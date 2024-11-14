//registerApi.ts
import { Session, SessionCallback, ErrorCallback, User } from "../model/common";
import { CustomError } from "../model/CustomError";

export function registerUser(user, onSuccess, onError) {
    fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })
    .then(async (response) => {
        if (response.ok) {
            const result = await response.json();
            onSuccess(result);
        } else {
            const errorData = await response.json();
            onError(new Error(errorData.message || "Erreur lors de l'inscription"));
        }
    })
    .catch((error) => {
        onError(new Error(error.message || "Erreur réseau"));
    });
}