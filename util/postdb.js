const { Pool, Client } = require('pg');
const config = require('config');

const UpdateDB = (userId, email, eventId) => {
  const pool = new Pool({
    user: "postgres",
    host: config.get("post_host"),
    database: config.get("post_database"),
    password: config.get("postgres"),
    port: "5432"
  })
  const query = `
        INSERT INTO public."event_state"(user_id, email, event_id)
        VALUES ('` + userId + `','` + email + `','` + eventId + `');`
  pool.query(query, (err, res ) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Table is successfully created');
    pool.end();
  });
}
exports.UpdateDB = UpdateDB