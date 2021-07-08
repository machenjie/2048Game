import Text = "mo:base/Text";
import Nat = "mo:base/Nat";
import Time = "mo:base/Time";
import TrieMap = "mo:base/TrieMap";
import Order = "mo:base/Order";
import Iter = "mo:base/Iter";
import Array = "mo:base/Array";
import Principal = "mo:base/Principal";

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
         #less
      } else if (left.score < right.score) {
         #greater
      } else {
         #less
      };
    };

    stable var userEntries : [(Text,User)] = [];
    let users = TrieMap.fromEntries<Text,User>(userEntries.vals(), Text.equal, Text.hash);
    stable var userScoreEntries : [(Text,UserScore)] = [];
    let userScores = TrieMap.fromEntries<Text,UserScore>(userScoreEntries.vals(), Text.equal, Text.hash);
    let topUserScoreMaxCount = 10;
    stable var topUserScores = Array.init<?UserScore>(topUserScoreMaxCount, null);

    public shared ({caller:Principal}) func register(principal :Text, name : Text) : async (Bool, Bool, Nat) {
        if (principal == "" or name == "" or Principal.toText(caller) != principal) {
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

    public query ({caller:Principal}) func userInfo(principal :Text) : async (Bool, ?User) {
        if (Principal.toText(caller) != principal) {
            return (false, null);
        };
        switch (users.get(principal)) {
                case (?user)  {(true, ?user)};
                case null { (false, null)};
        };
    };

    public shared ({caller:Principal}) func newScore(principal :Text, name : Text, score : Nat) {
        if (Principal.toText(caller) != principal) {
            return ();
        };
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
                        needUpdateScore := true;
                    };
                } else {
                    needUpdateScore := true;
                };
            };
            case null {
                needUpdateScore := true;
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
            var index = 0;
            label doInsert while (index < topUserScoreMaxCount) {
                let opCurUScore = topUserScores[index];
                switch opCurUScore {
                    case (?curUScore) {
                        let cmpResult = userScoreCompare(curUScore, uScore);
                         switch cmpResult {
                            case (#equal) {
                               topUserScores[index] := ?uScore;
                               break doInsert;
                            };
                            case (#less) {index+=1;};
                            case (#greater) {
                               var setToNextUserScore = ?curUScore;
                               var setToNextIndex = index+1;
                               label setToNext while (setToNextIndex < topUserScoreMaxCount) {
                                   let opNextUScore = topUserScores[setToNextIndex];
                                   switch opNextUScore {
                                     case (?nextUScore) {
                                        let cmpResult = userScoreCompare(nextUScore, uScore);
                                        switch cmpResult {
                                            case (#equal) {
                                               topUserScores[setToNextIndex] := setToNextUserScore;
                                               break  setToNext;
                                            };
                                            case _ {
                                              let tmp =  topUserScores[setToNextIndex];
                                              topUserScores[setToNextIndex] := setToNextUserScore;
                                              setToNextUserScore := tmp;
                                              setToNextIndex += 1;
                                            };
                                        };
                                     };
                                     case null {
                                         topUserScores[setToNextIndex] := setToNextUserScore;
                                         break  setToNext;
                                     };
                                   };
                               };
                               topUserScores[index] := ?uScore;
                               break doInsert;
                            };
                         };
                    };
                    case null {
                        topUserScores[index] := ?uScore;
                        break doInsert;
                    };
                };
            };
        };
    };

    public query func topScores() : async ?[(Text, Nat)] {
        let topUScores = Array.init<(Text, Nat)>(topUserScoreMaxCount, ("", 0));
        var index = 0;
        for ( opUScore in topUserScores.vals() ) {
            switch opUScore {
                case (?uScore) {
                    topUScores[index]:=(uScore.name, uScore.score);
                    index+=1;
                };
                case null {()};
            }
        };
        ?Array.freeze(topUScores)
    };

    system func preupgrade() {
        userEntries := Iter.toArray(users.entries());
        userScoreEntries := Iter.toArray(userScores.entries());
    };

    system func postupgrade() {
        for ( (_,uScore) in userScoreEntries.vals() ) {
            var index = 0;
            label doInsert while (index < topUserScoreMaxCount) {
                let opCurUScore = topUserScores[index];
                switch opCurUScore {
                    case (?curUScore) {
                        let cmpResult = userScoreCompare(curUScore, uScore);
                         switch cmpResult {
                            case (#equal) {
                               topUserScores[index] := ?uScore;
                               break doInsert;
                            };
                            case (#less) {index+=1;};
                            case (#greater) {
                               var setToNextUserScore = ?curUScore;
                               var setToNextIndex = index+1;
                               label setToNext while (setToNextIndex < topUserScoreMaxCount) {
                                   let opNextUScore = topUserScores[setToNextIndex];
                                   switch opNextUScore {
                                     case (?nextUScore) {
                                        let cmpResult = userScoreCompare(nextUScore, uScore);
                                        switch cmpResult {
                                            case (#equal) {
                                               topUserScores[setToNextIndex] := setToNextUserScore;
                                               break  setToNext;
                                            };
                                            case _ {
                                              let tmp =  topUserScores[setToNextIndex];
                                              topUserScores[setToNextIndex] := setToNextUserScore;
                                              setToNextUserScore := tmp;
                                              setToNextIndex += 1;
                                            };
                                        };
                                     };
                                     case null {
                                         topUserScores[setToNextIndex] := setToNextUserScore;
                                         break  setToNext;
                                     };
                                   };
                               };
                               topUserScores[index] := ?uScore;
                               break doInsert;
                            };
                         };
                    };
                    case null {
                        topUserScores[index] := ?uScore;
                        break doInsert;
                    };
                };
            };
        };
        userEntries := [];
        userScoreEntries := [];
    };
};
