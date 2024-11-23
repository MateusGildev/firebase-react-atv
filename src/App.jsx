import { initializeApp } from "firebase/app";
import { addDoc, collection, deleteDoc, getDocs, getFirestore, doc } from "firebase/firestore";
import { useEffect, useState } from "react";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBveJdeVkjfREzG2a0x8wJ4_oZEfk-cuPY",
  authDomain: "fir-projeto-atv03.firebaseapp.com",
  projectId: "fir-projeto-atv03",
});

export const App = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);

  const db = getFirestore(firebaseApp);
  const userCollectionRef = collection(db, "users");

  async function criarUser() {
    try {
      const user = await addDoc(userCollectionRef, { name, email });
      console.log("Usuário criado com ID:", user.id);
      setUsers((prev) => [...prev, { id: user.id, name, email }]); 
      setName(""); 
      setEmail(""); 
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
    }
  }

  async function deleteUser(id) {
    try {
      const userDoc = doc(db, "users", id); 
      await deleteDoc(userDoc);
      setUsers((prev) => prev.filter((user) => user.id !== id)); 
      console.log("Usuário deletado com ID:", id);
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
    }
  }

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await getDocs(userCollectionRef);
        setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    getUsers();
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="nome..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="email..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={criarUser}>Criar Usuário</button>
      <ul>
        {users.map((user) => (
          <div key={user.id}>
            <li>{user.name}</li>
            <li>{user.email}</li>
            <button onClick={() => deleteUser(user.id)}>Deletar</button>
          </div>
        ))}
      </ul>
    </div>
  );
};
