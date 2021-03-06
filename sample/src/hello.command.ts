import { Console, Argument, Command, Option, ConsoleBase, Logger } from 'nest-console'

@Console('hello')
export class HelloCommand extends ConsoleBase {
  @Command('world', 'test the nest-console')
  world(
    @Argument('arg1', 'argument one') arg1: string,
    @Argument('arg2', 'argument two') arg2: string,
    @Option('opt1', 'option one', 'haha') opt1: string,
    @Option('opt2', 'option two', false) opt2: string,
    @Option('opt3', 'option three', true) opt3: string,
    logger: Logger
  ) {
    logger.log('hello world', {
      arg1,
      arg2,
      opt1,
      opt2,
      opt3,
    })
  }
}
