module.exports = {
  username: 'postgres',
  password: 'docker',
  database: 'gobarber-db',
  host: 'localhost',
  port: '5433',
  dialect: 'postgres',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
}
