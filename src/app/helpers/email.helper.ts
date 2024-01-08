import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { GenericObject } from '../types';
const Util = require('util');
const ReadFile = Util.promisify(fs.readFile);
const Handlebars = require('handlebars');

@Injectable()
export class EmailHelper {
  public async createEmailContent(data: GenericObject, templateType: string) {
    try {
      const templatePath = path.join(
        process.cwd(),
        `views/email-templates/${templateType}.template.hbs`,
      );
      const content = await ReadFile(templatePath, 'utf8');

      const template = Handlebars.compile(content);

      return template(data);
    } catch (error) {}
  }
}
