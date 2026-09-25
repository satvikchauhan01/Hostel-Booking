export const CREATE_USER=`
INSERT INTO users(email,password,name) VALUES ($1, $2, $3) RETURNING id,name,email,created_at;`;

export const GET_USER_BY_EMAIL=`
SELECT id,name,email,created_at,password FROM users WHERE LOWER(email)=LOWER($1)`;

export const GET_USER_BY_ID=`
SELECT id,name,email,created_at FROM users WHERE id=$1`;
