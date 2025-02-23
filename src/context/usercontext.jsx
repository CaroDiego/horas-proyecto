import { createContext, useState } from "react";
import User from "../components/user";
import supabase from "../supabase/config";

const UserContext = createContext();

function UserProviderWrapper(props) {
  const [user, setUser] = useState(null);

  const logIn = async (user) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      });
      if (error) {
        console.error("Error al iniciar sesión: ", error);
        return;
      }

      await getUser();
    } catch (e) {
      console.error("An error occurred" + e.message);
    }
  };

  const getUser = async () => {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        console.log(userError);
      }
      setUser(userData.user.id);
    } catch (e) {
      console.error("Error al obtener datos de usuario: ", e);
    }
  };
  return (
    <UserContext.Provider
      value={{
        logIn,
        user,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProviderWrapper };
