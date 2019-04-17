export interface UserRequest {
  userName: string;
  academicDegree?: string;
  positionProfile?: string;
  summary?: string;
  industrySectors?: string[];
  specializations?: string[];
  certificates?: string[];
  languages?: string[];
  coach?: boolean;
}
