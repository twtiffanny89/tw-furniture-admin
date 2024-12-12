import { paginationModel } from "../global/pagination_model";

export interface AttributeListModel {
  data: AttributeModel[];
  pagination: paginationModel | null;
}

export interface AttributeModel {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
