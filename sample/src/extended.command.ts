import { Console, Command, ConsoleBase, Logger } from 'nest-console'

@Console('extended')
export class ExtendedCommand extends ConsoleBase {
  @Command('choice')
  async testChoices(logger: Logger) {
    logger.info(`You chose ${await this.choice('Choose your answer', ['a', 'b', 'c'])}`)
  }

  @Command('ask')
  async testInput(logger: Logger) {
    logger.info(`hello: ${await this.ask('What is your name?', 'haha')}`)
  }

  @Command('password')
  async testPassword(logger: Logger) {
    logger.info(`Your password is ${await this.password('What is your password?')}`)
  }

  @Command('confirm')
  async testConfirm(logger: Logger) {
    if (await this.confirm('Are you sure?')) {
      logger.info('Yes, done')
    } else {
      logger.error('No, canceled')
    }
  }

  @Command('checkbox')
  async testCheckbox(logger: Logger) {
    logger.info(`Checked: ${await this.checkbox('Choose your answer', ['a', 'b', 'c', 'd'], ['a', 'c'])}`)
  }

  @Command('table')
  testTable(logger: Logger) {
    logger.info(
      this.table('table test', [
        {
          name: 'Tim',
          job: 'freelancer',
          address: 'United States',
          birthday: '1983-02-12',
        },
        {
          name: '深澤直人',
          job: 'designer',
          address: '日本 山梨県',
          birthday: '1956-02-12',
        },
      ]).toString()
    )
  }
}
