import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [addFriend, setAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [bill, setBill] = useState(0);
  const [myExpense, setMyExpense] = useState("");

  function handleSelectedFriend(id) {
    setSelectedFriend(id);
    setBill(0);
    setMyExpense("");
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    console.log(friends);
  }

  function handleAddFriendForm() {
    setAddFriend(!addFriend);
  }

  function handleSplitValue(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList friends={friends} onSelectFriend={handleSelectedFriend} />
        <FormAddFriend ToggleFriend={addFriend} onAddFriend={handleAddFriend} />
        <Button onClick={handleAddFriendForm}>
          {!addFriend ? "Add Friend" : "Close"}
        </Button>
      </div>
      <FormSplitBill
        bill={bill}
        setBill={setBill}
        myExpense={myExpense}
        setMyExpense={setMyExpense}
        friends={friends}
        selectedFriend={selectedFriend}
        onSelectFriend={setSelectedFriend}
        onSplitBill={handleSplitValue}
      />
    </div>
  );
}

function FriendsList({ friends, onSelectFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          onSelectFriend={onSelectFriend}
          friend={friend}
          key={friend.id}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}&euro;
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}&euro;
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelectFriend(friend.id)}>Select</Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

function FormAddFriend({ ToggleFriend, onAddFriend }) {
  const [name, setName] = useState("");
  const [URL, setURL] = useState("");
  const [count, setCounter] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !URL) return;
    const newFriend = { name, image: URL, id: count, balance: 0 };
    onAddFriend(newFriend);
    setCounter(count + 1);
    setName("");
    setURL("");
  }
  if (ToggleFriend) {
    return (
      <form form className="form-add-friend">
        <label>👫 Friend name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>🖼 Image URL</label>
        <input
          type="text"
          value={URL}
          onChange={(e) => setURL(e.target.value)}
        />
        <Button onClick={(e) => handleSubmit(e)}>Add</Button>
      </form>
    );
  }
}

function FormSplitBill({
  friends,
  selectedFriend,
  bill,
  setBill,
  myExpense,
  setMyExpense,
  onSplitBill,
  onSelectFriend,
}) {
  const [whoPaid, setWhoPaid] = useState("user");
  const friend = friends.filter((friend) => friend.id === selectedFriend);
  const friendExpense = bill ? bill - myExpense : "";
  if (selectedFriend === null) return;
  function handleSplit(e) {
    e.preventDefault();
    onSplitBill(whoPaid === "user" ? friendExpense : -myExpense);
    onSelectFriend(null);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSplit}>
      <h2>Split a bill with {friend[0].name} </h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍‍♂️ Your expense</label>
      <input
        type="text"
        value={myExpense}
        onChange={(e) => setMyExpense(Number(e.target.value))}
      />

      <label>👩🏻‍🤝‍🧑🏻 {friend[0].name}'s expense</label>
      <input type="text" disabled value={friendExpense} />

      <label>🤑 Who is paying the bill</label>
      <select value={whoPaid} onChange={(e) => setWhoPaid(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{friend[0].name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
