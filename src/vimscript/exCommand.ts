import { ErrorCode, VimError } from '../error';
import { VimState } from '../state/vimState';
import { LineRange } from './lineRange';

export abstract class ExCommand {
  public readonly isRepeatableWithDot: boolean = true;

  abstract execute(vimState: VimState): Promise<void>;

  async executeWithRange(vimState: VimState, range: LineRange): Promise<void> {
    // By default, throw E481 ("No range allowed")
    throw VimError.fromCode(ErrorCode.NoRangeAllowed);
  }
}
