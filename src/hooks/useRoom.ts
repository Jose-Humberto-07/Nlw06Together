import { useEffect, useState } from "react";

import { database } from '../services/firebase';


type FireBaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
}>

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
}

export function useRoom(roomId: string) {
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');


    //hook dispara um evento sempre que um informação muda
    //se o array de dependências estiver vazio as informação vão ser renderizadas apenas uma única vez.
    //consumindo as perguntas (listando na tela)

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);


        roomRef.once('value', room => {
            const databaseRoom = room.val();
            const firebaseQuestions: FireBaseQuestions = databaseRoom.questions ?? {};


            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighLighted: value.isHighLighted,
                    isAnswered: value.isAnswered,
                };
            });


            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        });
    }, [roomId]);

    return { questions, title };
}