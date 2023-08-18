import IStatus from "./IStatus";

interface ICard {
  id: string,
  name: string,
  description: string,
  status: IStatus,
  hidden: boolean
}

export default ICard;