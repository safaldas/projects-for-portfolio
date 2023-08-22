import IStatus from "./IStatus";

interface ICard {
  id: string,
  name: string,
  description: string,
  status: IStatus,
  projectId: number
}

export default ICard;