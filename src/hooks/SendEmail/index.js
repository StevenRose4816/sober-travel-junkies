import React, {useCallback} from 'react';
import Mailer from 'react-native-mail';
import auth from '@react-native-firebase/auth';

export const useSendEmail = ({subject, recipients, body, dateFromRedux}) => {
  const userId = auth().currentUser?.uid;
  const sendEmail = useCallback(
    ({isHTML = false, attachments} = {}) => {
      return new Promise((resolve, reject) => {
        Mailer.mail(
          {
            subject,
            recipients: recipients,
            body: `${body}\n\n UID: ${userId}`,
            isHTML,
            attachments,
          },
          (error, event) => {
            if (error) {
              return reject(error);
            }
            resolve(event);
          },
        );
      });
    },
    [subject, dateFromRedux],
  );

  return {
    sendEmail,
  };
};
