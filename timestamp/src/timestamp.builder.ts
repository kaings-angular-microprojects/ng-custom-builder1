import { Builder, BuilderContext, BuilderConfiguration, BuildEvent } from "@angular-devkit/architect"; 
import { TimestampBuilderSchema } from "./schema";
import { Observable, bindNodeCallback, of } from "rxjs";
import { catchError, tap, map } from "rxjs/operators";
import { getSystemPath } from "@angular-devkit/core";
import { writeFile } from "fs";
import dateFormat from 'dateformat';
//var dateFormat = require('dateformat')

export default class TimestampBuilder implements Builder<TimestampBuilderSchema> {
    constructor(private context: BuilderContext) {}

    run(builderConfig: BuilderConfiguration<Partial<TimestampBuilderSchema>>): Observable<BuildEvent> {
        const root = this.context.workspace.root;
        const {path, format} = builderConfig.options;
        const timestampFileName = `${getSystemPath(root)}/${path}`;
        const writeFileObservable = bindNodeCallback(writeFile);
        return writeFileObservable(timestampFileName, dateFormat(new Date(), format)).pipe(
            map(() => ({success: true})),
            tap(() => this.context.logger.info("Timestamp created")),
            catchError(e => {
              this.context.logger.error("Failed to create timestamp", e);
              return of({success: false});
            })
          );
    }
}