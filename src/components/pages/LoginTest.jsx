import axios from 'axios';
import React, { useState } from 'react'

function LoginTest() {
  const [u_name, setUname] = useState("")
  const [u_pass, setUpass] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("login Success")
    const Data = {
      username: u_name,
      password: u_pass
    }
    console.log(Data);
    setUname("");
    setUpass("")
    const API = "http://52.66.71.147/banquetapi/user_login_new.php";
    axios.post(API, Data)
      .then((res) => {
        console.log(res.result)
      })
      .catch((err) => {
        console.log(err);

      })
  }
  return (
    <div >
      <form onSubmit={handleSubmit}>
        <input type="text" name="u_name" value={u_name} onChange={(e) => setUname(e.target.value)} placeholder="Email" />
        <input type="password" name="u_pass" value={u_pass}
          onChange={(e) => setUpass(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default LoginTest
