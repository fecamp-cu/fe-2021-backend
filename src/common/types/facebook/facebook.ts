export type FacebookUserInfo = {
  id: string;
  name: string;
  email: string;
  picture: FacebookPicture;
};

export type FacebookPicture = {
  data: {
    height: number;
    is_silhouette: boolean;
    url: string;
    width: number;
  };
};
