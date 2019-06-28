export interface User {
  id: string;
  userName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  department?: string;
  academicDegree?: string;
  positionProfile?: string;
  summary?: string;
  industrySectors?: string[];
  specializations?: string[];
  certificates?: string[];
  languages?: string[];
}
