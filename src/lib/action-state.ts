export type ActionState = {
  error: string | null;
  message: string | null;
  savedAt: string | null;
};

export const emptyActionState: ActionState = {
  error: null,
  message: null,
  savedAt: null,
};

export function actionFailure(error: string): ActionState {
  return { error, message: null, savedAt: null };
}

export function actionSuccess(message: string, savedAt: string): ActionState {
  return { error: null, message, savedAt };
}
