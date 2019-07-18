import * as inquirer from 'inquirer'
import * as AsciiTable from 'ascii-table-unicode'

export class ConsoleBase {
  async ask(message: string, defaultValue?: string | ((answers: any) => string | Promise<string>)): Promise<string> {
    const ret: { input: string } = await inquirer.prompt({
      type: 'input',
      name: 'input',
      message,
      default: defaultValue,
    })

    return ret.input
  }

  async password(
    message: string,
    defaultValue?: string | ((answers: any) => string | Promise<string>)
  ): Promise<string> {
    const ret: { password: string } = await inquirer.prompt({
      type: 'password',
      message,
      name: 'password',
      default: defaultValue,
    })
    return ret.password
  }

  async confirm(message: string): Promise<boolean> {
    const ret: { confirm: boolean } = await inquirer.prompt({
      type: 'confirm',
      name: 'confirm',
      message,
    })

    return ret.confirm
  }

  async choice(message: string, choices: ReadonlyArray<string>, defaultValue?: string): Promise<string> {
    const ret: { list: string } = await inquirer.prompt({
      type: 'list',
      name: 'list',
      choices,
      message,
      default: defaultValue,
    })

    return ret.list
  }

  async checkbox(message: string, choices: ReadonlyArray<string>, defaultValue?: string[]): Promise<string[]> {
    const ret: { checkbox: string[] } = await inquirer.prompt({
      type: 'checkbox',
      name: 'checkbox',
      choices,
      message,
      default: defaultValue,
    })

    return ret.checkbox
  }

  table(title: string, data: ReadonlyArray<{ [key: string]: any }>) {
    const table = new AsciiTable(title)
    if (!data || data.length < 1) {
      return table
    }
    const heading = Object.keys(data[0])
    table.setHeading(heading)
    for (const row of data) {
      table.addRow(heading.map((key) => row[key]))
    }

    return table
  }
}
