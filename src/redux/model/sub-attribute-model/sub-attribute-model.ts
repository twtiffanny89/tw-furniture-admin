import { paginationModel } from "../global/pagination_model";

export interface SubAttrinuteListModel {
  data: SubAttributeModel[];
  pagination: paginationModel | null;
}

export interface SubAttributeModel {
  id: string;
  valueType: string;
  value: string;
  label: string;
  attributeId: string;
  createdAt: string;
  updatedAt: string;
}
