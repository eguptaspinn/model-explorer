import {Injectable} from '@angular/core';
import {GraphCollection} from '../components/visualizer/common/input_graph';

export interface PassStage {
  stageId: string;
  label: string;
}

export interface RunPassResult {
  graphCollections?: GraphCollection[];
  stages?: PassStage[];
  error?: string;
  diagnostics?: string[];
}

@Injectable({providedIn: 'root'})
export class PassRunnerService {
  // Stages produced so far, per model file (singleton, so it persists).
  private readonly stagesByModel = new Map<string, PassStage[]>();

  getStages(modelPath: string): PassStage[] {
    return this.stagesByModel.get(modelPath) ?? [];
  }

  async runPassPipeline(
    modelPath: string,
    pipeline: string,
    baseStageId: string,
  ): Promise<RunPassResult> {
    try {
      const resp = await fetch('/apipost/v1/run_pass_pipeline', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({modelPath, pipeline, baseStageId}),
      });
      if (!resp.ok) {
        return {error: `Request failed: ${resp.status}`};
      }
      const result = (await resp.json()) as RunPassResult;
      if (result.stages && result.stages.length > 0) {
        const list = this.stagesByModel.get(modelPath) ?? [];
        list.push(...result.stages);
        this.stagesByModel.set(modelPath, list);
      }
      return result;
    } catch (e) {
      return {error: `${e}`};
    }
  }
}
