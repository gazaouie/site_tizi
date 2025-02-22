import {addUser} from './server.js';

document.getElementById('registerForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const dateOfBirth = document.getElementById('dateOfBirth').value;
  const address = document.getElementById('address').value;

  if (!name || !dateOfBirth || !address) {
    alert('All fields are required!');
    return;
  }else{
    addUser(name, dateOfBirth, address);
  }
});
