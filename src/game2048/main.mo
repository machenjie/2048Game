import Text = "mo:base/Text";
import Nat = "mo:base/Nat";
import Time = "mo:base/Time";
import TrieMap = "mo:base/TrieMap";
import Order = "mo:base/Order";
import Iter = "mo:base/Iter";
import Array = "mo:base/Array";
import RBTree = "mo:base/RBTree";

actor {
    type User = object {
        principal: Text;
        name: Text;
        id: Nat;
        date: Time.Time;
    };

    type UserScore = {
        principal: Text;
        name: Text;
        score: Nat;
        date: Time.Time;
    };

    func userScoreCompare(left: UserScore, right: UserScore) : Order.Order {
      if (left.principal == right.principal){
         return #equal
      };

      if (left.score > right.score) {
         #greater
      } else if (left.score < right.score) {
         #less
      } else {
         #greater
      };
    };

    stable var userEntries : [(Text,User)] = [];
    let users = TrieMap.fromEntries<Text,User>(userEntries.vals(), Text.equal, Text.hash);
    stable var userScoreEntries : [(Text,UserScore)] = [];
    let userScores = TrieMap.fromEntries<Text,UserScore>(userScoreEntries.vals(), Text.equal, Text.hash);
    let topUserScoreMaxCount = 20;
    let topUserScores = RBTree.RBTree<UserScore,()>(userScoreCompare);

    public func register(principal :Text, name : Text) : async (Bool, Bool, Nat) {
        if (principal == "" or name == "") {
            return (false, false, 0);
        };
        switch (users.get(principal)) {
            case (?user)  {
              if (user.name == name) {
                (true, false, user.id);
              }else {
               (false, false, user.id);
              };
            };
            case null {
              users.put(principal, {
                principal=principal;
                name=name;
                id=users.size()+1;
                date= Time.now();
              });
              (true, true, users.size())
            };
        };
    };

    public query func userInfo(principal :Text) : async (Bool, ?User) {
        switch (users.get(principal)) {
                case (?user)  {(true, ?user)};
                case null { (false, null)};
        };
    };

    public func newScore(principal :Text, name : Text, score : Nat) {
        switch (users.get(principal)) {
            case (?user)  {
                if (user.name == name) {
                    ()
                } else {
                    return
                };
            };
            case null { return };
        };
        var needUpdateScore = false;
        switch (userScores.get(principal)) {
            case (?userScore)  {
                if (userScore.name == name) {
                    if (userScore.score < score) {
                        needUpdateScore := true
                    };
                } else {
                    needUpdateScore := true
                };
            };
            case null {
                needUpdateScore := true
            };
        };
        if (needUpdateScore) {
            let uScore = {
                 principal=principal;
                 name=name;
                 score=score;
                 date= Time.now();
            };
            userScores.put(principal, uScore);
            topUserScores.put(uScore, ());
            label checkSize loop {
                if (RBTree.size<UserScore, ()>(topUserScores.share()) > topUserScoreMaxCount) {
                   ignore do ? {
                      let uScore = topUserScores.entriesRev().next() !;
                      topUserScores.delete(uScore.0);
                   }
                } else {
                    break checkSize
                }
            }
        };
    };

    public query func topScores() : async ?[(Text, Nat)] {
        let size = RBTree.size<UserScore, ()>(topUserScores.share());
        if (size <= 0) {
            return null
        };
        let topUScores = Array.init<(Text, Nat)>(size, ("", 0));
        var index = 0;
        for ( (uScore,_) in topUserScores.entries() ) {
            topUScores[index]:=(uScore.name, uScore.score);
            index+=1;
        };
        ?Array.freeze(topUScores)
    };

    system func preupgrade() {
        userEntries := Iter.toArray(users.entries());
        userScoreEntries := Iter.toArray(userScores.entries());
    };

    system func postupgrade() {
        userEntries := [];
        userScoreEntries := [];
    };
};
