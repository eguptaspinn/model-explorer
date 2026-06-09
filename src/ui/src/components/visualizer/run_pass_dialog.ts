import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {PassStage} from '../../services/pass_runner_service';

export interface RunPassDialogData {
  modelPath: string;
  stages: PassStage[];
  defaultStageId: string;
}

export interface RunPassDialogResult {
  pipeline: string;
  baseStageId: string;
}

@Component({
  standalone: true,
  selector: 'run-pass-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './run_pass_dialog.ng.html',
  styleUrls: ['./run_pass_dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RunPassDialog {
  readonly pipeline = new FormControl<string>('', Validators.required);
  // '' means "original IR (from file)".
  readonly baseStageId = new FormControl<string>('');

  constructor(
    public dialogRef: MatDialogRef<RunPassDialog>,
    @Inject(MAT_DIALOG_DATA) public data: RunPassDialogData,
  ) {
    this.baseStageId.setValue(data.defaultStageId ?? '');
  }

  handleRun() {
    const value = (this.pipeline.value || '').trim();
    if (!value) return;
    const result: RunPassDialogResult = {
      pipeline: value,
      baseStageId: this.baseStageId.value ?? '',
    };
    this.dialogRef.close(result);
  }
}
