# Data Types

Data Types define the nature and structure of the data that flows through the workflow. Each data type specifies the kind of information a node can handle, ensuring that data is processed correctly and consistently. Some data types are objects and expose internal properties that can be accessed by using `.` as separator: `post.title`.

Here is a list of the available data types.

- array
- boolean
- datetime
- email
- input
- integer
- node: id, name, label, activation_timestamp
- post: id, title, content, excerpt, status, type, date, modified, permalink
- site: name, description, url, home_url, admin_email
- string
- user: id, email, login, display_name, roles, caps, registered
- workflow: id, title, description, modified_at
