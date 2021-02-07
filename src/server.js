import chalk from 'chalk'
import app from './app'

app.listen(5000, () => console.log(chalk.bgGreen(chalk.whiteBright('API has been started in port 5000!'))))

app.on('error', error => console.log(chalk.bgRed(chalk.whiteBright(error.message))))
