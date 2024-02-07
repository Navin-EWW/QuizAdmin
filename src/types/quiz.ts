export interface subjectDataType {
    subjectName: string;
    descriptionName?: string;
  }
  
 export  interface subjectRequestType{
    name: string,
    discription?: string
    userId?:string
    sortBy?:string
    sortType?:string
    per_page?:number
    current_page?:number
}
  
  export interface subjectResponseType{
    id: number
    userId: number
    name: string
    discription: string
    createdAt: string
    updatedAt: string
    deletedAt: any
}