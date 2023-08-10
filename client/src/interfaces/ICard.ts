import IStatus from "./IStatus";

interface ICard {
  id: string,
  title: string,
  description: string,
  status: IStatus,
  hidden: boolean
}

export default ICard;