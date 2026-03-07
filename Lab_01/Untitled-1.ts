interface IUser {
  name: string;
  age: number;
}

interface ILocation {
  city: string;
  country: string;
}

interface IUser1 extends IUser {
  location: ILocation;
}

interface IUser2 extends IUser {
  skills: string[];
}

interface IArrayItem {
  id: number;
  name: string;
  group: number;
}

interface IExamsSimple {
  maths: boolean;
  programming: boolean;
}

interface IStudies4 {
  university: string;
  speciality: string;
  year: number;
  exams: IExamsSimple;
}

interface IUser4 extends IUser {
  studies: IStudies4;
}

interface IDepartment {
  faculty: string;
  group: number;
}

interface IExamBase {
  mark: number;
  maths?: boolean;
  programming?: boolean;
}

interface IStudies5 {
  university: string;
  speciality: string;
  year: number;
  department: IDepartment;
  exams: IExamBase[];
}

interface IUser5 extends IUser {
  studies: IStudies5;
}

interface IProfessor {
  name: string;
  degree: string;
}

interface IExamWithProfessor extends IExamBase {
  professor: IProfessor;
}

interface IStudies6 {
  university: string;
  speciality: string;
  year: number;
  department: IDepartment;
  exams: IExamWithProfessor[];
}

interface IUser6 extends IUser {
  studies: IStudies6;
}

interface IArticle {
  title: string;
  pagesNumber: number;
}

interface IProfessorWithArticles extends IProfessor {
  articles: IArticle[];
}

interface IExamWithArticles extends IExamBase {
  professor: IProfessorWithArticles;
}

interface IStudies7 {
  university: string;
  speciality: string;
  year: number;
  department: IDepartment;
  exams: IExamWithArticles[];
}

interface IUser7 extends IUser {
  studies: IStudies7;
}

interface IPost {
  id: number;
  message: string;
  likesCount: number;
}

interface IProfilePage {
  posts: IPost[];
  newPostText: string;
}

interface IDialog {
  id: number;
  name: string;
}

interface IMessage {
  id: number;
  message: string;
}

interface IDialogsPage {
  dialogs: IDialog[];
  messages: IMessage[];
}

interface IState {
  profilePage: IProfilePage;
  dialogsPage: IDialogsPage;
}

interface IStore {
  state: IState;
}

let user: IUser = {
  name: 'Masha',
  age: 21
};
let userCopy: IUser = { ...user };
console.log("userCopy:", userCopy);

let numbers: number[] = [1, 2, 3];
let numbersCopy: number[] = [...numbers];
console.log("numbersCopy:", numbersCopy);

let user1: IUser1 = {
  name: 'Masha',
  age: 23,
  location: {
    city: 'Minsk',
    country: 'Belarus'
  }
};
let user1Copy: IUser1 = {
  ...user1,
  location: { ...user1.location }
};
console.log("user1Copy:", user1Copy);

let user2: IUser2 = {
  name: 'Masha',
  age: 28,
  skills: ["HTML", "CSS", "JavaScript", "React"]
};
let user2Copy: IUser2 = {
  ...user2,
  skills: [...user2.skills]
};
console.log("user2Copy:", user2Copy);

const array: IArrayItem[] = [
  { id: 1, name: 'Vasya', group: 10 },
  { id: 2, name: 'Ivan', group: 11 },
  { id: 3, name: 'Masha', group: 12 },
  { id: 4, name: 'Petya', group: 10 },
  { id: 5, name: 'Kira', group: 11 },
];
let arrayCopy: IArrayItem[] = array.map(item => ({ ...item }));
console.log("arrayCopy:", arrayCopy);

let user4: IUser4 = {
  name: 'Masha',
  age: 19,
  studies: {
    university: 'BSTU',
    speciality: 'designer',
    year: 2020,
    exams: {
      maths: true,
      programming: false
    }
  }
};
let user4Copy: IUser4 = {
  ...user4,
  studies: {
    ...user4.studies,
    exams: { ...user4.studies.exams }
  }
};
console.log("user4Copy:", user4Copy);

let user5: IUser5 = {
  name: 'Masha',
  age: 22,
  studies: {
    university: 'BSTU',
    speciality: 'designer',
    year: 2020,
    department: {
      faculty: 'FIT',
      group: 10,
    },
    exams: [
      { maths: true, mark: 8 },
      { programming: true, mark: 4 },
    ]
  }
};

let user5Copy: IUser5 = {
  ...user5,
  studies: {
    ...user5.studies,
    department: { ...user5.studies.department },
    exams: user5.studies.exams.map(ex => ({ ...ex }))
  }
};

user5Copy.studies.department.group = 12;
user5Copy.studies.exams[1].mark = 10;

console.log("user5Copy:", user5Copy);

let user6: IUser6 = {
  name: 'Masha',
  age: 21,
  studies: {
    university: 'BSTU',
    speciality: 'designer',
    year: 2020,
    department: {
      faculty: 'FIT',
      group: 10,
    },
    exams: [
      {
        maths: true,
        mark: 8,
        professor: {
          name: 'Ivan Ivanov',
          degree: 'PhD'
        }
      },
      {
        programming: true,
        mark: 10,
        professor: {
          name: 'Petr Petrov',
          degree: 'PhD'
        }
      },
    ]
  }
};

let user6Copy: IUser6 = {
  ...user6,
  studies: {
    ...user6.studies,
    department: { ...user6.studies.department },
    exams: user6.studies.exams.map(ex => ({
      ...ex,
      professor: { ...ex.professor }
    }))
  }
};

user6Copy.studies.exams[0].professor.name = "NEW PROFESSOR NAME";

console.log("user6Copy:", user6Copy);

let user7: IUser7 = {
  name: 'Masha',
  age: 20,
  studies: {
    university: 'BSTU',
    speciality: 'designer',
    year: 2020,
    department: {
      faculty: 'FIT',
      group: 10,
    },
    exams: [
      {
        maths: true,
        mark: 8,
        professor: {
          name: 'Ivan Petrov',
          degree: 'PhD',
          articles: [
            { title: "About HTML", pagesNumber: 3 },
            { title: "About CSS", pagesNumber: 5 },
            { title: "About JavaScript", pagesNumber: 1 },
          ]
        }
      },
      {
        programming: true,
        mark: 10,
        professor: {
          name: 'Petr Ivanov',
          degree: 'PhD',
          articles: [
            { title: "About HTML", pagesNumber: 3 },
            { title: "About CSS", pagesNumber: 5 },
            { title: "About JavaScript", pagesNumber: 1 },
          ]
        }
      },
    ]
  }
};

let user7Copy: IUser7 = {
  ...user7,
  studies: {
    ...user7.studies,
    department: { ...user7.studies.department },
    exams: user7.studies.exams.map(ex => ({
      ...ex,
      professor: {
        ...ex.professor,
        articles: ex.professor.articles.map(a => ({ ...a }))
      }
    }))
  }
};

const articleToChange = user7Copy.studies.exams[1].professor.articles
  .find(a => a.title === "About CSS");
if (articleToChange) {
  articleToChange.pagesNumber = 3;
}

console.log("user7Copy:", user7Copy);

let store: IStore = {
  state: {
    profilePage: {
      posts: [
        { id: 1, message: 'Hi', likesCount: 12 },
        { id: 2, message: 'By', likesCount: 1 }
      ],
      newPostText: 'About me'
    },
    dialogsPage: {
      dialogs: [
        { id: 1, name: 'Valera' },
        { id: 2, name: 'Andrey' },
        { id: 3, name: 'Sasha' },
        { id: 4, name: 'Viktor' }
      ],
      messages: [
        { id: 1, message: 'hi' },
        { id: 2, message: 'hi hi' },
        { id: 3, message: 'hi hi hi' }
      ]
    }
  }
};

let storeCopy: IStore = {
  ...store,
  state: {
    ...store.state,
    profilePage: {
      ...store.state.profilePage,
      posts: store.state.profilePage.posts.map(post => ({ ...post }))
    },
    dialogsPage: {
      ...store.state.dialogsPage,
      dialogs: store.state.dialogsPage.dialogs.map(dialog => ({ ...dialog })),
      messages: store.state.dialogsPage.messages.map(message => ({ ...message }))
    }
  }
};

storeCopy.state.dialogsPage.messages.forEach(post => {
  post.message = "Hello";
});

console.log("storeCopy:", storeCopy);