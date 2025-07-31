// If you already have this file, just add the IChallenge interface.
// If not, create it.

// This should match the structure of the data coming from your backend API
export interface IChallenge {
  _id: string;
  title: string;
  prize: number;
  status: "draft" | "published" | "active" | "judging" | "completed";
  // Add any other fields you expect from the API
}
