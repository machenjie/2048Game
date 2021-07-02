import Text = "mo:base/Text";
import Time = "mo:base/Time";
import TrieMap = "mo:base/TrieMap";
import RBTree = "mo:base/RBTree";
import Order = "mo:base/Order";

actor {
    type User = object {
        principal: Text;
        name: Text;
        id: Nat;
        date: Time.Time;
    };

    type UserScore = {
        principal: Text;
        score: Nat;
        date: Time.Time;
    };

    func userScoreOrder(left:UserScore, right:UserScore): Order.Order{
        if (left.score < right.score) {
            return #less;
        };
        if (left.score > right.score) {
            return #greater;
        };
        return #equal;
    };

    let users = TrieMap.TrieMap<Text,User>(Text.equal, Text.hash);
    let userScores = RBTree.RBTree<UserScore,User>(userScoreOrder);

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
    }
};
