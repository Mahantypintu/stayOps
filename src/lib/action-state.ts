export type ActionState = {
  error: string | null;
  message: string | null;
  savedAt: string | null;
  revision: string | null;
};

export const emptyActionState: ActionState = {
  error: null,
  message: null,
  savedAt: null,
  revision: null,
};

function nextRevision() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function actionFailure(error: string): ActionState {
  return { error, message: null, savedAt: null, revision: nextRevision() };
}

export function actionSuccess(message: string, savedAt: string): ActionState {
  return { error: null, message, savedAt, revision: nextRevision() };
}
