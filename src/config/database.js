module.exports = {
  username: 'postgres',
  password: 'postgres',
  database: 'gobarber_db',
  host: 'localhost',
  port: '5432',
  dialect: 'postgres',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
}
