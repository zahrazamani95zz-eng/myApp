import type { Attachment } from "../../domain";

export interface UploadRepository {
  upload(file: File): Promise<Attachment>;
}
