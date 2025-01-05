import Queue from 'queue';
import { Logger } from './util/logger';

type TaskName =
  | 'compositionEnd'
  | 'compositionStart'
  | 'onDidChangeActiveTextEditor'
  | 'onDidChangeTextEditorSelection'
  | 'onDidChangeTextEditorVisibleRanges'
  | 'replacePreviousChar'
  | 'type'
  | 'vim.cmd'
  | 'vim.remap'
  | { key: string; command: string };

function getTaskName(taskName: TaskName): string {
  return typeof taskName === 'string' ? taskName : taskName.key;
}

class TaskQueue {
  private readonly taskQueue = new Queue({ autostart: true, concurrency: 1 });

  constructor() {
    this.taskQueue.addListener('error', (err, _task) => {
      // TODO: Report via telemetry API?
      Logger.error(`Error running task: ${err}`);
    });
  }

  /**
   * Adds a task to the task queue.
   */
  public enqueueTask(taskName: TaskName, task: () => Promise<void>): void {
    Logger.trace(`TaskQueue: enqueue ${getTaskName(taskName)}, length: ${this.taskQueue.length}`);
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.taskQueue.push(task);
  }
}

export const taskQueue = new TaskQueue();
