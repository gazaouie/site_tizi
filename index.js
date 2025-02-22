document.getElementById('registerForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const dateOfBirth = document.getElementById('dateOfBirth').value;
  const address = document.getElementById('address').value;

  if (!name || !dateOfBirth || !address) {
    alert('All fields are required!');
    return;
  }

  const user = { name, dateOfBirth, address };

  try {
    const response = await fetch('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });

    if (response.ok) {
      alert('User registered successfully!');
      document.getElementById('registerForm').reset();
    } else {
      const errorData = await response.json();
      alert('Error: ' + errorData.message);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
});
