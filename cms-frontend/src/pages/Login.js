import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import ToastContext from "../context/ToastContext";

const Login = () => {
  const { toast } = useContext(ToastContext);
  const { loginUser } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!credentials.email || !credentials.password) {
      toast.error("please enter all the required fields!");
      return;
    }

    loginUser(credentials);
  };

  return (
    <>
    <div class="card my-5">
  <div class="card-header">
 <h4> Login</h4>
  </div>
  <div class="card-body">
    

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="emailInput" className="form-label mt-4">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="emailInput"
            aria-describedby="emailHelp"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
            placeholder="Enter your E-mail"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="passwordInput" className="form-label mt-4">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="passwordInput"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            placeholder="Enter Password"
            required
          />
        </div>
        <input type="submit" value="Login" className="btn btn-primary my-3" />
        <p>
          Don't have an account ? <Link to="/register">Sign up</Link>
        </p>
      </form>
      </div>
      </div>
    </>
  );
};

export default Login;
