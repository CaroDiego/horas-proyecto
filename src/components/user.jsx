import { useContext, useState } from "react";
import "./AddDay.css";
import { UserContext } from "../context/usercontext";

function User() {
  const { logIn, user } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailChange = (e) => {
    setEmail(e.target.value);
  };

  const passwordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      email,
      password,
    };
    await logIn(user);
  };

  const isFormValid = email && password;

  return (
    <div className="AddHours-container">

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Correo</label>
        <input type="email" value={email} onChange={emailChange} />

        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={passwordChange}
          required
        />

        <button type="submit" disabled={!isFormValid}>
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}

export default User;
