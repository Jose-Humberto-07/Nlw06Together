import { useEffect, useState } from "react";

import { database } from '../services/firebase';
import { useAuth } from "./useAuth";


type FireBaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>
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
    likeCount: number;
    LikeId: string | undefined;
}

export function useRoom(roomId: string) {
    const { user } = useAuth();
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
                    likeCount: Object.values(value.likes ?? {}).length,    
                    LikeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
                };
            });


            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        });

        return () => {
            roomRef.off('value');
        } 


    }, [roomId, user?.id]);

    return { questions, title };
}