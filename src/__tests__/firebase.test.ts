import { app, db } from "../lib/firebase";

describe("Firebase Setup", () => {
  it("initializes firebase app successfully", () => {
    expect(app).toBeDefined();
    expect(app.name).toBe("[DEFAULT]");
  });

  it("initializes firestore properly", () => {
    expect(db).toBeDefined();
  });
});
