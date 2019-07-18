# nest-console
The nest-console module eases the creation of beautiful and testable command line interfaces for applications base on nestjs framework.

## installation
```shell
yarn add nest-console
```

or

```shell
npm install nest-console --save
```

## write a console class

```typescript
import { Console, Argument, Option, Logger, Command } from 'nest-console' 

@Console('hello')
export class HelloCommand {
    @Command('test')
    test(
        @Argument('arg1', 'The first argument') arg1: string,
        @Argument('arg2', 'The second argument') arg2: string,
        @Option('opt1', 'The first option') opt1: string,
        logger: Logger
    ) {
        logger.info({
            arg1,
            arg2,
            opt1
        })
    }
}

```
