// I18N — Mensagens de serviços, validações e respostas da API.
// As mensagens originais não são alteradas nos serviços.

const MENSAGENS = new Map([
  [
    "Valor de notificações inválido.",
    [
      "Valor de notificações inválido.",
      "Valor de notificaciones no válido.",
      "Invalid notification setting."
    ]
  ],
  [
    "Valor de localização inválido.",
    [
      "Valor de localização inválido.",
      "Valor de ubicación no válido.",
      "Invalid location setting."
    ]
  ],
  [
    "Ordenação inválida.",
    [
      "Ordenação inválida.",
      "Orden no válido.",
      "Invalid sort order."
    ]
  ],
  [
    "Categoria inválida.",
    [
      "Categoria inválida.",
      "Categoría no válida.",
      "Invalid category."
    ]
  ],
  [
    "Identificador inválido.",
    [
      "Identificador inválido.",
      "Identificador no válido.",
      "Invalid identifier."
    ]
  ],
  [
    "Conselho não encontrado.",
    [
      "Conselho não encontrado.",
      "Consejo no encontrado.",
      "Advice not found."
    ]
  ],
  [
    "Você não tem permissão para alterar este conselho.",
    [
      "Você não tem permissão para alterar este conselho.",
      "No tienes permiso para modificar este consejo.",
      "You do not have permission to modify this advice."
    ]
  ],
  [
    "Dados inválidos.",
    [
      "Dados inválidos.",
      "Datos no válidos.",
      "Invalid data."
    ]
  ],
  [
    "Selecione uma categoria válida.",
    [
      "Selecione uma categoria válida.",
      "Selecciona una categoría válida.",
      "Select a valid category."
    ]
  ],
  [
    "Categoria não encontrada.",
    [
      "Categoria não encontrada.",
      "Categoría no encontrada.",
      "Category not found."
    ]
  ],
  [
    "Nenhum campo válido informado.",
    [
      "Nenhum campo válido informado.",
      "No se ha proporcionado ningún campo válido.",
      "No valid fields provided."
    ]
  ],
  [
    "Conselho excluído com sucesso.",
    [
      "Conselho excluído com sucesso.",
      "Consejo eliminado correctamente.",
      "Advice deleted successfully."
    ]
  ],
  [
    "Curtida registrada com sucesso.",
    [
      "Curtida registrada com sucesso.",
      "Me gusta registrado correctamente.",
      "Like added successfully."
    ]
  ],
  [
    "Você já curtiu este conselho.",
    [
      "Você já curtiu este conselho.",
      "Ya te gusta este consejo.",
      "You have already liked this advice."
    ]
  ],
  [
    "Curtida removida com sucesso.",
    [
      "Curtida removida com sucesso.",
      "Me gusta eliminado correctamente.",
      "Like removed successfully."
    ]
  ],
  [
    "Atividade não encontrada.",
    [
      "Atividade não encontrada.",
      "Actividad no encontrada.",
      "Activity not found."
    ]
  ],
  [
    "Atividade adicionada aos favoritos.",
    [
      "Atividade adicionada aos favoritos.",
      "Actividad añadida a favoritos.",
      "Activity added to favorites."
    ]
  ],
  [
    "A atividade já está nos favoritos.",
    [
      "A atividade já está nos favoritos.",
      "La actividad ya está en favoritos.",
      "This activity is already in favorites."
    ]
  ],
  [
    "Atividade removida dos favoritos.",
    [
      "Atividade removida dos favoritos.",
      "Actividad eliminada de favoritos.",
      "Activity removed from favorites."
    ]
  ],
  [
    "Frase não encontrada.",
    [
      "Frase não encontrada.",
      "Frase no encontrada.",
      "Phrase not found."
    ]
  ],
  [
    "Frase adicionada aos favoritos.",
    [
      "Frase adicionada aos favoritos.",
      "Frase añadida a favoritos.",
      "Phrase added to favorites."
    ]
  ],
  [
    "A frase já está nos favoritos.",
    [
      "A frase já está nos favoritos.",
      "La frase ya está en favoritos.",
      "This phrase is already in favorites."
    ]
  ],
  [
    "Frase removida dos favoritos.",
    [
      "Frase removida dos favoritos.",
      "Frase eliminada de favoritos.",
      "Phrase removed from favorites."
    ]
  ],
  [
    "Lugar não encontrado.",
    [
      "Lugar não encontrado.",
      "Lugar no encontrado.",
      "Place not found."
    ]
  ],
  [
    "Lugar adicionado aos favoritos.",
    [
      "Lugar adicionado aos favoritos.",
      "Lugar añadido a favoritos.",
      "Place added to favorites."
    ]
  ],
  [
    "O lugar já está nos favoritos.",
    [
      "O lugar já está nos favoritos.",
      "El lugar ya está en favoritos.",
      "This place is already in favorites."
    ]
  ],
  [
    "Lugar removido dos favoritos.",
    [
      "Lugar removido dos favoritos.",
      "Lugar eliminado de favoritos.",
      "Place removed from favorites."
    ]
  ],
  [
    "Você não tem permissão para alterar esta atividade.",
    [
      "Você não tem permissão para alterar esta atividade.",
      "No tienes permiso para modificar esta actividad.",
      "You do not have permission to modify this activity."
    ]
  ],
  [
    "Não foi possível enviar a imagem.",
    [
      "Não foi possível enviar a imagem.",
      "No se pudo enviar la imagen.",
      "Could not upload the image."
    ]
  ],
  [
    "Usuário não encontrado.",
    [
      "Usuário não encontrado.",
      "Usuario no encontrado.",
      "User not found."
    ]
  ],
  [
    "Usuário inativo.",
    [
      "Usuário inativo.",
      "Usuario inactivo.",
      "Inactive user."
    ]
  ],
  [
    "Nenhuma imagem foi enviada.",
    [
      "Nenhuma imagem foi enviada.",
      "No se envió ninguna imagen.",
      "No image was uploaded."
    ]
  ],
  [
    "Formato de imagem inválido.",
    [
      "Formato de imagem inválido.",
      "Formato de imagen no válido.",
      "Invalid image format."
    ]
  ],
  [
    "Não foi possível enviar a foto.",
    [
      "Não foi possível enviar a foto.",
      "No se pudo enviar la foto.",
      "Could not upload the photo."
    ]
  ],
  [
    "Busca inválida.",
    [
      "Busca inválida.",
      "Búsqueda no válida.",
      "Invalid search."
    ]
  ],
  [
    "Dados da frase inválidos.",
    [
      "Dados da frase inválidos.",
      "Datos de la frase no válidos.",
      "Invalid phrase data."
    ]
  ],
  [
    "Estado da frase inválido.",
    [
      "Estado da frase inválido.",
      "Estado de la frase no válido.",
      "Invalid phrase status."
    ]
  ],
  [
    "Nenhum campo válido para atualizar.",
    [
      "Nenhum campo válido para atualizar.",
      "No hay campos válidos para actualizar.",
      "No valid fields to update."
    ]
  ],
  [
    "Frase desativada com sucesso.",
    [
      "Frase desativada com sucesso.",
      "Frase desactivada correctamente.",
      "Phrase deactivated successfully."
    ]
  ],
  [
    "Informe um valor válido e maior que zero.",
    [
      "Informe um valor válido e maior que zero.",
      "Introduce un valor válido mayor que cero.",
      "Enter a valid amount greater than zero."
    ]
  ],
  [
    "Informe um período válido.",
    [
      "Informe um período válido.",
      "Introduce un período válido.",
      "Enter a valid period."
    ]
  ],
  [
    "Dados do gasto inválidos.",
    [
      "Dados do gasto inválidos.",
      "Datos del gasto no válidos.",
      "Invalid expense data."
    ]
  ],
  [
    "Informe um conceito de até 150 caracteres.",
    [
      "Informe um conceito de até 150 caracteres.",
      "Introduce un concepto de hasta 150 caracteres.",
      "Enter an expense description of up to 150 characters."
    ]
  ],
  [
    "Informe uma data válida.",
    [
      "Informe uma data válida.",
      "Introduce una fecha válida.",
      "Enter a valid date."
    ]
  ],
  [
    "Observação inválida.",
    [
      "Observação inválida.",
      "Observación no válida.",
      "Invalid note."
    ]
  ],
  [
    "A observação deve ter no máximo 3000 caracteres.",
    [
      "A observação deve ter no máximo 3000 caracteres.",
      "La observación debe tener como máximo 3000 caracteres.",
      "The note must be no longer than 3000 characters."
    ]
  ],
  [
    "Identificador do gasto inválido.",
    [
      "Identificador do gasto inválido.",
      "Identificador del gasto no válido.",
      "Invalid expense identifier."
    ]
  ],
  [
    "Gasto não encontrado.",
    [
      "Gasto não encontrado.",
      "Gasto no encontrado.",
      "Expense not found."
    ]
  ],
  [
    "Gasto excluído com sucesso.",
    [
      "Gasto excluído com sucesso.",
      "Gasto eliminado correctamente.",
      "Expense deleted successfully."
    ]
  ],
  [
    "Esta atividade já passou do horário de início.",
    [
      "Esta atividade já passou do horário de início.",
      "Esta actividad ya ha superado su hora de inicio.",
      "This activity has already passed its start time."
    ]
  ],
  [
    "Interesse registrado com sucesso.",
    [
      "Interesse registrado com sucesso.",
      "Interés registrado correctamente.",
      "Interest registered successfully."
    ]
  ],
  [
    "Você já demonstrou interesse nesta atividade.",
    [
      "Você já demonstrou interesse nesta atividade.",
      "Ya has mostrado interés en esta actividad.",
      "You have already shown interest in this activity."
    ]
  ],
  [
    "Interesse removido com sucesso.",
    [
      "Interesse removido com sucesso.",
      "Interés eliminado correctamente.",
      "Interest removed successfully."
    ]
  ],
  [
    "Utilize a rota de fotografias para alterar a imagem.",
    [
      "Utilize a rota de fotografias para alterar a imagem.",
      "Utiliza la función de fotografías para modificar la imagen.",
      "Use the photo endpoint to change the image."
    ]
  ],
  [
    "Informe o nome do lugar.",
    [
      "Informe o nome do lugar.",
      "Introduce el nombre del lugar.",
      "Enter the place name."
    ]
  ],
  [
    "O campo ativo deve ser booleano.",
    [
      "O campo ativo deve ser booleano.",
      "El estado activo debe ser verdadero o falso.",
      "The active status must be true or false."
    ]
  ],
  [
    "Informe a latitude e a longitude juntas.",
    [
      "Informe a latitude e a longitude juntas.",
      "Introduce la latitud y la longitud juntas.",
      "Enter both latitude and longitude."
    ]
  ],
  [
    "Lugar desativado com sucesso.",
    [
      "Lugar desativado com sucesso.",
      "Lugar desactivado correctamente.",
      "Place deactivated successfully."
    ]
  ],
  [
    "Se o e-mail estiver cadastrado, você receberá as instruções de recuperação.",
    [
      "Se o e-mail estiver cadastrado, você receberá as instruções de recuperação.",
      "Si el correo está registrado, recibirás las instrucciones de recuperación.",
      "If the email address is registered, you will receive recovery instructions."
    ]
  ],
  [
    "Informe um e-mail válido.",
    [
      "Informe um e-mail válido.",
      "Introduce un correo electrónico válido.",
      "Enter a valid email address."
    ]
  ],
  [
    "Código de recuperação inválido.",
    [
      "Código de recuperação inválido.",
      "Código de recuperación no válido.",
      "Invalid recovery code."
    ]
  ],
  [
    "A senha deve ter pelo menos 6 caracteres.",
    [
      "A senha deve ter pelo menos 6 caracteres.",
      "La contraseña debe tener al menos 6 caracteres.",
      "The password must be at least 6 characters long."
    ]
  ],
  [
    "A senha excede o tamanho máximo permitido.",
    [
      "A senha excede o tamanho máximo permitido.",
      "La contraseña supera la longitud máxima permitida.",
      "The password exceeds the maximum allowed length."
    ]
  ],
  [
    "Código inválido ou expirado.",
    [
      "Código inválido ou expirado.",
      "Código no válido o vencido.",
      "Invalid or expired code."
    ]
  ],
  [
    "Senha redefinida com sucesso.",
    [
      "Senha redefinida com sucesso.",
      "Contraseña restablecida correctamente.",
      "Password reset successfully."
    ]
  ],
  [
    "Dados da tarefa inválidos.",
    [
      "Dados da tarefa inválidos.",
      "Datos de la tarea no válidos.",
      "Invalid task data."
    ]
  ],
  [
    "Informe o título da tarefa.",
    [
      "Informe o título da tarefa.",
      "Introduce el título de la tarea.",
      "Enter the task title."
    ]
  ],
  [
    "O título deve ter no máximo 150 caracteres.",
    [
      "O título deve ter no máximo 150 caracteres.",
      "El título debe tener como máximo 150 caracteres.",
      "The title must be no longer than 150 characters."
    ]
  ],
  [
    "Descrição inválida.",
    [
      "Descrição inválida.",
      "Descripción no válida.",
      "Invalid description."
    ]
  ],
  [
    "A descrição deve ter no máximo 3000 caracteres.",
    [
      "A descrição deve ter no máximo 3000 caracteres.",
      "La descripción debe tener como máximo 3000 caracteres.",
      "The description must be no longer than 3000 characters."
    ]
  ],
  [
    "Informe uma data limite válida.",
    [
      "Informe uma data limite válida.",
      "Introduce una fecha límite válida.",
      "Enter a valid due date."
    ]
  ],
  [
    "Identificador da tarefa inválido.",
    [
      "Identificador da tarefa inválido.",
      "Identificador de la tarea no válido.",
      "Invalid task identifier."
    ]
  ],
  [
    "Tarefa não encontrada.",
    [
      "Tarefa não encontrada.",
      "Tarea no encontrada.",
      "Task not found."
    ]
  ],
  [
    "Estado inicial não configurado.",
    [
      "Estado inicial não configurado.",
      "El estado inicial no está configurado.",
      "The initial status is not configured."
    ]
  ],
  [
    "Tarefa excluída com sucesso.",
    [
      "Tarefa excluída com sucesso.",
      "Tarea eliminada correctamente.",
      "Task deleted successfully."
    ]
  ],
  [
    "Estado inválido.",
    [
      "Estado inválido.",
      "Estado no válido.",
      "Invalid status."
    ]
  ],
  [
    "Informe um estado válido.",
    [
      "Informe um estado válido.",
      "Selecciona un estado válido.",
      "Select a valid status."
    ]
  ],
  [
    "Filtro de estado inválido.",
    [
      "Filtro de estado inválido.",
      "Filtro de estado no válido.",
      "Invalid status filter."
    ]
  ],
  [
    "Já existe um registro com esses dados.",
    [
      "Já existe um registro com esses dados.",
      "Ya existe un registro con esos datos.",
      "A record with these details already exists."
    ]
  ],
  [
    "Não foi possível concluir devido aos relacionamentos.",
    [
      "Não foi possível concluir devido aos relacionamentos.",
      "No se pudo completar la operación debido a registros asociados.",
      "The operation could not be completed because of related records."
    ]
  ],
  [
    "Não foi possível processar a solicitação.",
    [
      "Não foi possível processar a solicitação.",
      "No se pudo procesar la solicitud.",
      "Could not process the request."
    ]
  ],
  [
    "E-mail e senha são obrigatórios.",
    [
      "E-mail e senha são obrigatórios.",
      "El correo y la contraseña son obligatorios.",
      "Email and password are required."
    ]
  ],
  [
    "E-mail ou senha inválidos.",
    [
      "E-mail ou senha inválidos.",
      "Correo o contraseña incorrectos.",
      "Incorrect email or password."
    ]
  ],
  [
    "Todos os campos são obrigatórios.",
    [
      "Todos os campos são obrigatórios.",
      "Todos los campos son obligatorios.",
      "All fields are required."
    ]
  ],
  [
    "Já existe uma conta com este e-mail.",
    [
      "Já existe uma conta com este e-mail.",
      "Ya existe una cuenta con este correo.",
      "An account with this email already exists."
    ]
  ],
  [
    "Rol Estudante não encontrado.",
    [
      "Rol Estudante não encontrado.",
      "Rol de estudiante no encontrado.",
      "Student role not found."
    ]
  ],
  [
    "País de origem inválido.",
    [
      "País de origem inválido.",
      "País de origen no válido.",
      "Invalid country of origin."
    ]
  ],
  [
    "Universidade de origem inválida.",
    [
      "Universidade de origem inválida.",
      "Universidad de origen no válida.",
      "Invalid home university."
    ]
  ],
  [
    "A universidade de origem não pertence ao país selecionado.",
    [
      "A universidade de origem não pertence ao país selecionado.",
      "La universidad de origen no pertenece al país seleccionado.",
      "The home university is not in the selected country."
    ]
  ],
  [
    "Universidade de destino inválida.",
    [
      "Universidade de destino inválida.",
      "Universidad de destino no válida.",
      "Invalid host university."
    ]
  ],
  [
    "A universidade de destino deve estar localizada em Chapecó.",
    [
      "A universidade de destino deve estar localizada em Chapecó.",
      "La universidad de destino debe estar ubicada en Chapecó.",
      "The host university must be located in Chapecó."
    ]
  ],
  [
    "Erro ao realizar login.",
    [
      "Erro ao realizar login.",
      "No se pudo iniciar sesión.",
      "Could not sign in."
    ]
  ],
  [
    "Erro ao cadastrar usuário.",
    [
      "Erro ao cadastrar usuário.",
      "No se pudo registrar el usuario.",
      "Could not register the user."
    ]
  ],
  [
    "Erro ao buscar usuário.",
    [
      "Erro ao buscar usuário.",
      "No se pudo consultar el usuario.",
      "Could not retrieve the user."
    ]
  ],
  [
    "Erro ao atualizar perfil.",
    [
      "Erro ao atualizar perfil.",
      "No se pudo actualizar el perfil.",
      "Could not update the profile."
    ]
  ],
  [
    "Muitas tentativas de login. Tente novamente em 15 minutos.",
    [
      "Muitas tentativas de login. Tente novamente em 15 minutos.",
      "Demasiados intentos de inicio de sesión. Inténtalo de nuevo en 15 minutos.",
      "Too many sign-in attempts. Try again in 15 minutes."
    ]
  ],
  [
    "Token não informado.",
    [
      "Token não informado.",
      "No se proporcionó el token.",
      "Authentication token missing."
    ]
  ],
  [
    "Token inválido.",
    [
      "Token inválido.",
      "Token no válido.",
      "Invalid token."
    ]
  ],
  [
    "Sessão expirada. Faça login novamente.",
    [
      "Sessão expirada. Faça login novamente.",
      "La sesión ha vencido. Inicia sesión nuevamente.",
      "Session expired. Please sign in again."
    ]
  ],
  [
    "Perfil de acesso inválido.",
    [
      "Perfil de acesso inválido.",
      "Perfil de acceso no válido.",
      "Invalid access profile."
    ]
  ],
  [
    "Token inválido ou expirado.",
    [
      "Token inválido ou expirado.",
      "Token no válido o vencido.",
      "Invalid or expired token."
    ]
  ],
  [
    "Não foi possível verificar a autenticação.",
    [
      "Não foi possível verificar a autenticação.",
      "No se pudo verificar la autenticación.",
      "Could not verify authentication."
    ]
  ],
  [
    "Formato de imagem não permitido.",
    [
      "Formato de imagem não permitido.",
      "Formato de imagen no permitido.",
      "Image format not allowed."
    ]
  ],
  [
    "A imagem deve ter no máximo 5 MB.",
    [
      "A imagem deve ter no máximo 5 MB.",
      "La imagen debe tener como máximo 5 MB.",
      "The image must be no larger than 5 MB."
    ]
  ],
  [
    "Muitas solicitações. Tente novamente em 15 minutos.",
    [
      "Muitas solicitações. Tente novamente em 15 minutos.",
      "Demasiadas solicitudes. Inténtalo de nuevo en 15 minutos.",
      "Too many requests. Try again in 15 minutes."
    ]
  ],
  [
    "Muitas tentativas. Tente novamente em 15 minutos.",
    [
      "Muitas tentativas. Tente novamente em 15 minutos.",
      "Demasiados intentos. Inténtalo de nuevo en 15 minutos.",
      "Too many attempts. Try again in 15 minutes."
    ]
  ],
  [
    "Não é possível alterar o estado da própria conta.",
    [
      "Não é possível alterar o estado da própria conta.",
      "No puedes modificar el estado de tu propia cuenta.",
      "You cannot change the status of your own account."
    ]
  ],
  [
    "Não é possível alterar contas administrativas.",
    [
      "Não é possível alterar contas administrativas.",
      "No se pueden modificar cuentas administrativas.",
      "Administrator accounts cannot be modified."
    ]
  ],
  [
    "Tipo de conteúdo inválido.",
    [
      "Tipo de conteúdo inválido.",
      "Tipo de contenido no válido.",
      "Invalid content type."
    ]
  ],
  [
    "Conteúdo não encontrado.",
    [
      "Conteúdo não encontrado.",
      "Contenido no encontrado.",
      "Content not found."
    ]
  ],
  [
    "Comentário não encontrado.",
    [
      "Comentário não encontrado.",
      "Comentario no encontrado.",
      "Comment not found."
    ]
  ],
  [
    "Comentário excluído pela administração.",
    [
      "Comentário excluído pela administração.",
      "Comentario eliminado por la administración.",
      "Comment deleted by an administrator."
    ]
  ],
  [
    "Data inválida.",
    [
      "Data inválida.",
      "Fecha no válida.",
      "Invalid date."
    ]
  ],
  [
    "Horário inválido.",
    [
      "Horário inválido.",
      "Hora no válida.",
      "Invalid time."
    ]
  ],
  [
    "A data e o horário da atividade devem estar no futuro.",
    [
      "A data e o horário da atividade devem estar no futuro.",
      "La fecha y la hora de la actividad deben ser futuras.",
      "The activity date and time must be in the future."
    ]
  ],
  [
    "Atividade excluída com sucesso.",
    [
      "Atividade excluída com sucesso.",
      "Actividad eliminada correctamente.",
      "Activity deleted successfully."
    ]
  ],
  [
    "Campo de configuração inválido.",
    [
      "Campo de configuração inválido.",
      "Campo de configuración no válido.",
      "Invalid settings field."
    ]
  ],
  [
    "Idioma inválido.",
    [
      "Idioma inválido.",
      "Idioma no válido.",
      "Invalid language."
    ]
  ],
  [
    "Tema inválido.",
    [
      "Tema inválido.",
      "Tema no válido.",
      "Invalid theme."
    ]
  ],
  [
    "Informe uma frase em português de até 300 caracteres.",
    [
      "Informe uma frase em português de até 300 caracteres.",
      "Introduce una frase en portugués de hasta 300 caracteres.",
      "Enter a Portuguese phrase of up to 300 characters."
    ]
  ],
  [
    "Informe uma tradução em espanhol de até 300 caracteres.",
    [
      "Informe uma tradução em espanhol de até 300 caracteres.",
      "Introduce una traducción en español de hasta 300 caracteres.",
      "Enter a Spanish translation of up to 300 characters."
    ]
  ],
  [
    "Informe uma tradução em inglês de até 300 caracteres.",
    [
      "Informe uma tradução em inglês de até 300 caracteres.",
      "Introduce una traducción en inglés de hasta 300 caracteres.",
      "Enter an English translation of up to 300 characters."
    ]
  ],
  [
    "Informe uma explicação em espanhol de até 3000 caracteres.",
    [
      "Informe uma explicação em espanhol de até 3000 caracteres.",
      "Introduce una explicación en español de hasta 3000 caracteres.",
      "Enter a Spanish explanation of up to 3000 characters."
    ]
  ],
  [
    "Informe uma explicação em inglês de até 3000 caracteres.",
    [
      "Informe uma explicação em inglês de até 3000 caracteres.",
      "Introduce una explicación en inglés de hasta 3000 caracteres.",
      "Enter an English explanation of up to 3000 characters."
    ]
  ],
  [
    "Informe uma explicação em português de até 3000 caracteres.",
    [
      "Informe uma explicação em português de até 3000 caracteres.",
      "Introduce una explicación en portugués de hasta 3000 caracteres.",
      "Enter a Portuguese explanation of up to 3000 characters."
    ]
  ],
  [
    "Tipo de categoria inválido.",
    [
      "Tipo de categoria inválido.",
      "Tipo de categoría no válido.",
      "Invalid category type."
    ]
  ],
  [
    "Informe um nome de até 60 caracteres.",
    [
      "Informe um nome de até 60 caracteres.",
      "Introduce un nombre de hasta 60 caracteres.",
      "Enter a name of up to 60 characters."
    ]
  ],
  [
    "Já existe uma categoria com esse nome.",
    [
      "Já existe uma categoria com esse nome.",
      "Ya existe una categoría con ese nombre.",
      "A category with this name already exists."
    ]
  ],
  [
    "Não é possível excluir uma categoria com conteúdos associados.",
    [
      "Não é possível excluir uma categoria com conteúdos associados.",
      "No se puede eliminar una categoría con contenidos asociados.",
      "A category with associated content cannot be deleted."
    ]
  ],
  [
    "Categoria excluída com sucesso.",
    [
      "Categoria excluída com sucesso.",
      "Categoría eliminada correctamente.",
      "Category deleted successfully."
    ]
  ],
  [
    "Dados da atividade inválidos.",
    [
      "Dados da atividade inválidos.",
      "Datos de la actividad no válidos.",
      "Invalid activity data."
    ]
  ],
  [
    "Relacionamento inválido.",
    [
      "Relacionamento inválido.",
      "Relación no válida.",
      "Invalid relationship."
    ]
  ],
  [
    "Não foi possível processar a imagem.",
    [
      "Não foi possível processar a imagem.",
      "No se pudo procesar la imagen.",
      "Could not process the image."
    ]
  ],
  [
    "Imagem atualizada com sucesso.",
    [
      "Imagem atualizada com sucesso.",
      "Imagen actualizada correctamente.",
      "Image updated successfully."
    ]
  ],
  [
    "Imagem removida com sucesso.",
    [
      "Imagem removida com sucesso.",
      "Imagen eliminada correctamente.",
      "Image removed successfully."
    ]
  ],
  [
    "Erro ao consultar configurações.",
    [
      "Erro ao consultar configurações.",
      "No se pudo consultar la configuración.",
      "Could not retrieve settings."
    ]
  ],
  [
    "Configurações atualizadas com sucesso.",
    [
      "Configurações atualizadas com sucesso.",
      "Configuración actualizada correctamente.",
      "Settings updated successfully."
    ]
  ],
  [
    "Erro ao atualizar configurações.",
    [
      "Erro ao atualizar configurações.",
      "No se pudo actualizar la configuración.",
      "Could not update settings."
    ]
  ],
  [
    "Dados da categoria inválidos.",
    [
      "Dados da categoria inválidos.",
      "Datos de la categoría no válidos.",
      "Invalid category data."
    ]
  ],
  [
    "A categoria possui relacionamentos associados.",
    [
      "A categoria possui relacionamentos associados.",
      "La categoría tiene registros asociados.",
      "The category has associated records."
    ]
  ],
  [
    "Foto atualizada com sucesso.",
    [
      "Foto atualizada com sucesso.",
      "Foto actualizada correctamente.",
      "Photo updated successfully."
    ]
  ],
  [
    "Erro ao atualizar foto de perfil.",
    [
      "Erro ao atualizar foto de perfil.",
      "No se pudo actualizar la foto de perfil.",
      "Could not update the profile photo."
    ]
  ],
  [
    "Foto removida com sucesso.",
    [
      "Foto removida com sucesso.",
      "Foto eliminada correctamente.",
      "Photo removed successfully."
    ]
  ],
  [
    "Erro ao remover foto de perfil.",
    [
      "Erro ao remover foto de perfil.",
      "No se pudo eliminar la foto de perfil.",
      "Could not remove the profile photo."
    ]
  ],
  [
    "Não foi possível atualizar a imagem.",
    [
      "Não foi possível atualizar a imagem.",
      "No se pudo actualizar la imagen.",
      "Could not update the image."
    ]
  ],
  [
    "Não foi possível remover a imagem.",
    [
      "Não foi possível remover a imagem.",
      "No se pudo eliminar la imagen.",
      "Could not remove the image."
    ]
  ],
  [
    "Dados do lugar inválidos.",
    [
      "Dados do lugar inválidos.",
      "Datos del lugar no válidos.",
      "Invalid place data."
    ]
  ],
  [
    "Erro ao listar países.",
    [
      "Erro ao listar países.",
      "No se pudo cargar la lista de países.",
      "Could not load countries."
    ]
  ],
  [
    "Não foi possível solicitar a recuperação.",
    [
      "Não foi possível solicitar a recuperação.",
      "No se pudo solicitar la recuperación.",
      "Could not request password recovery."
    ]
  ],
  [
    "Não foi possível redefinir a senha.",
    [
      "Não foi possível redefinir a senha.",
      "No se pudo restablecer la contraseña.",
      "Could not reset the password."
    ]
  ],
  [
    "Erro ao listar universidades.",
    [
      "Erro ao listar universidades.",
      "No se pudo cargar la lista de universidades.",
      "Could not load universities."
    ]
  ],
  [
    "Usuário não autenticado.",
    [
      "Usuário não autenticado.",
      "Usuario no autenticado.",
      "User not authenticated."
    ]
  ],
  [
    "Você não possui permissão para acessar este recurso.",
    [
      "Você não possui permissão para acessar este recurso.",
      "No tienes permiso para acceder a este recurso.",
      "You do not have permission to access this resource."
    ]
  ],
  [
    "Informe o nome da categoria.",
    [
      "Informe o nome da categoria.",
      "Introduce el nombre de la categoría.",
      "Enter the category name."
    ]
  ],
  [
    "O nome deve possuir até 60 caracteres.",
    [
      "O nome deve possuir até 60 caracteres.",
      "El nombre debe tener como máximo 60 caracteres.",
      "The name must be no longer than 60 characters."
    ]
  ],
  [
    "Não é possível excluir uma categoria com lugares associados.",
    [
      "Não é possível excluir uma categoria com lugares associados.",
      "No se puede eliminar una categoría con lugares asociados.",
      "A category with associated places cannot be deleted."
    ]
  ],
  [
    "O comentário não pode estar vazio.",
    [
      "O comentário não pode estar vazio.",
      "El comentario no puede estar vacío.",
      "The comment cannot be empty."
    ]
  ],
  [
    "O comentário deve ter no máximo 1000 caracteres.",
    [
      "O comentário deve ter no máximo 1000 caracteres.",
      "El comentario debe tener como máximo 1000 caracteres.",
      "The comment must be no longer than 1000 characters."
    ]
  ],
  [
    "Identificador do comentário inválido.",
    [
      "Identificador do comentário inválido.",
      "Identificador del comentario no válido.",
      "Invalid comment identifier."
    ]
  ],
  [
    "Você não tem permissão para alterar este comentário.",
    [
      "Você não tem permissão para alterar este comentário.",
      "No tienes permiso para modificar este comentario.",
      "You do not have permission to modify this comment."
    ]
  ],
  [
    "Comentário publicado com sucesso.",
    [
      "Comentário publicado com sucesso.",
      "Comentario publicado correctamente.",
      "Comment posted successfully."
    ]
  ],
  [
    "Comentário atualizado com sucesso.",
    [
      "Comentário atualizado com sucesso.",
      "Comentario actualizado correctamente.",
      "Comment updated successfully."
    ]
  ],
  [
    "Comentário excluído com sucesso.",
    [
      "Comentário excluído com sucesso.",
      "Comentario eliminado correctamente.",
      "Comment deleted successfully."
    ]
  ],
  [
    "Dados do conselho inválidos.",
    [
      "Dados do conselho inválidos.",
      "Datos del consejo no válidos.",
      "Invalid advice data."
    ]
  ],
  [
    "Sessão não encontrada.",
    [
      "Sessão não encontrada.",
      "Sesión no encontrada.",
      "Session not found."
    ]
  ],
  [
    "Tipo de moderação inválido.",
    [
      "Tipo de moderação inválido.",
      "Tipo de moderación no válido.",
      "Invalid moderation type."
    ]
  ],
  [
    "Estado da tarefa não encontrado.",
    [
      "Estado da tarefa não encontrado.",
      "Estado de la tarea no encontrado.",
      "Task status not found."
    ]
  ],
  [
    "Erro ao comunicar com o servidor.",
    [
      "Erro ao comunicar com o servidor.",
      "No se pudo establecer comunicación con el servidor.",
      "Could not communicate with the server."
    ]
  ],
  [
    "Nenhuma imagem selecionada.",
    [
      "Nenhuma imagem selecionada.",
      "No se seleccionó ninguna imagen.",
      "No image selected."
    ]
  ],
  [
    "Arquivo não encontrado.",
    [
      "Arquivo não encontrado.",
      "Archivo no encontrado.",
      "File not found."
    ]
  ],
  [
    "Tipo de favorito inválido.",
    [
      "Tipo de favorito inválido.",
      "Tipo de favorito no válido.",
      "Invalid favorite type."
    ]
  ],
  [
    "Recurso nativo indisponível no navegador.",
    [
      "Recurso nativo indisponível no navegador.",
      "Función nativa no disponible en el navegador.",
      "Native feature unavailable in the browser."
    ]
  ],
  [
    "Permissão de notificação negada.",
    [
      "Permissão de notificação negada.",
      "Permiso de notificaciones denegado.",
      "Notification permission denied."
    ]
  ],
  [
    "Permissão da câmera negada.",
    [
      "Permissão da câmera negada.",
      "Permiso de cámara denegado.",
      "Camera permission denied."
    ]
  ],
  [
    "Permissão da galeria negada.",
    [
      "Permissão da galeria negada.",
      "Permiso de galería denegado.",
      "Gallery permission denied."
    ]
  ],
  [
    "Permissão de localização negada.",
    [
      "Permissão de localização negada.",
      "Permiso de ubicación denegado.",
      "Location permission denied."
    ]
  ],
  [
    "Ative os serviços de localização do dispositivo.",
    [
      "Ative os serviços de localização do dispositivo.",
      "Activa los servicios de ubicación del dispositivo.",
      "Enable location services on your device."
    ]
  ],
  [
    "Não foi possível obter a localização. Verifique o GPS do dispositivo.",
    [
      "Não foi possível obter a localização. Verifique o GPS do dispositivo.",
      "No se pudo obtener la ubicación. Comprueba el GPS del dispositivo.",
      "Could not get your location. Check your device's GPS."
    ]
  ],
  [
    "Conteúdo salvo, mas não foi possível atualizar a foto.",
    [
      "Conteúdo salvo, mas não foi possível atualizar a foto.",
      "Contenido guardado, pero no se pudo actualizar la foto.",
      "Content saved, but the photo could not be updated."
    ]
  ],
  [
    "Não foi possível consultar as permissões.",
    [
      "Não foi possível consultar as permissões.",
      "No se pudieron consultar los permisos.",
      "Could not check permissions."
    ]
  ],
  [
    "Não foi possível carregar os dados salvos.",
    [
      "Não foi possível carregar os dados salvos.",
      "No se pudieron cargar los datos guardados.",
      "Could not load saved data."
    ]
  ],
  [
    "Network request failed",
    [
      "Não foi possível conectar ao servidor. Verifique sua conexão.",
      "No se pudo conectar con el servidor. Comprueba tu conexión.",
      "Could not connect to the server. Check your connection."
    ]
  ],
  [
    "Failed to fetch",
    [
      "Não foi possível conectar ao servidor. Verifique sua conexão.",
      "No se pudo conectar con el servidor. Comprueba tu conexión.",
      "Could not connect to the server. Check your connection."
    ]
  ],
  [
    "Erro ao buscar roles.",
    [
      "Erro ao buscar roles.",
      "No se pudieron consultar los roles.",
      "Could not retrieve roles."
    ]
  ],
  [
    "Rol não encontrado.",
    [
      "Rol não encontrado.",
      "Rol no encontrado.",
      "Role not found."
    ]
  ],
  [
    "Erro ao buscar rol.",
    [
      "Erro ao buscar rol.",
      "No se pudo consultar el rol.",
      "Could not retrieve the role."
    ]
  ],
  [
    "O nome do rol é obrigatório.",
    [
      "O nome do rol é obrigatório.",
      "El nombre del rol es obligatorio.",
      "The role name is required."
    ]
  ],
  [
    "Erro ao criar rol.",
    [
      "Erro ao criar rol.",
      "No se pudo crear el rol.",
      "Could not create the role."
    ]
  ],
  [
    "Erro ao atualizar rol.",
    [
      "Erro ao atualizar rol.",
      "No se pudo actualizar el rol.",
      "Could not update the role."
    ]
  ],
  [
    "Rol excluído com sucesso.",
    [
      "Rol excluído com sucesso.",
      "Rol eliminado correctamente.",
      "Role deleted successfully."
    ]
  ],
  [
    "Erro ao excluir rol.",
    [
      "Erro ao excluir rol.",
      "No se pudo eliminar el rol.",
      "Could not delete the role."
    ]
  ],
  [
    "Acesso administrativo autorizado.",
    [
      "Acesso administrativo autorizado.",
      "Acceso administrativo autorizado.",
      "Administrative access authorized."
    ]
  ],
  [
    "API InterChapecó funcionando.",
    [
      "API InterChapecó funcionando.",
      "API de InterChapecó en funcionamiento.",
      "InterChapecó API is running."
    ]
  ],
  [
    "Etapa inválida.",
    [
      "Etapa inválida.",
      "Etapa no válida.",
      "Invalid stage."
    ]
  ],
  [
    "Prioridade inválida.",
    [
      "Prioridade inválida.",
      "Prioridad no válida.",
      "Invalid priority."
    ]
  ]
]);


const INDICES = { 'pt-BR': 0, es: 1, en: 2 };
const GENERICA = [
  'Não foi possível processar a solicitação. Tente novamente.',
  'No se pudo procesar la solicitud. Inténtalo de nuevo.',
  'Could not process the request. Please try again.',
];
const AVISO_FOTO = 'Conteúdo salvo, mas não foi possível atualizar a foto.';

const CAMPOS = {
  nome: ['nome', 'nombre', 'name'],
  titulo: ['título', 'título', 'title'],
  conteudo: ['conteúdo', 'contenido', 'content'],
  descricao: ['descrição', 'descripción', 'description'],
  endereco: ['endereço', 'dirección', 'address'],
  cidade: ['cidade', 'ciudad', 'city'],
  estado: ['estado', 'estado', 'state'],
  bairro: ['bairro', 'barrio', 'neighborhood'],
  telefone: ['telefone', 'teléfono', 'phone'],
  horario: ['horário', 'horario', 'opening hours'],
  siteUrl: ['site', 'sitio web', 'website'],
  latitude: ['latitude', 'latitud', 'latitude'],
  longitude: ['longitude', 'longitud', 'longitude'],
  local: ['local', 'lugar', 'location'],
  localizacao: ['localização', 'ubicación', 'location'],
  dataAtividade: ['data da atividade', 'fecha de la actividad', 'activity date'],
  horaInicio: ['hora de início', 'hora de inicio', 'start time'],
  horaFim: ['hora de término', 'hora de finalización', 'end time'],
  ativo: ['estado ativo', 'estado activo', 'active status'],
};

const PADROES = [
  [/^O campo (\w+) é obrigatório\.$/, campo => [
    `O campo ${campo} é obrigatório.`,
    `El campo ${campo} es obligatorio.`,
    `The ${campo} field is required.`,
  ]],
  [/^O campo (\w+) excede o limite permitido\.$/, campo => [
    `O campo ${campo} excede o limite permitido.`,
    `El campo ${campo} supera el límite permitido.`,
    `The ${campo} field exceeds the allowed limit.`,
  ]],
  [/^O campo (\w+) deve conter uma URL válida\.$/, campo => [
    `O campo ${campo} deve conter uma URL válida.`,
    `El campo ${campo} debe contener una URL válida.`,
    `The ${campo} field must contain a valid URL.`,
  ]],
  [/^(?:Campo )?(\w+) inválid[oa]\.$/, campo => [
    `Valor inválido para ${campo}.`,
    `Valor no válido para ${campo}.`,
    `Invalid value for ${campo}.`,
  ]],
];

// Preserva mensagens de interface que já foram traduzidas com t().
function existeNoDicionario(dicionario, mensagem) {
  if (!dicionario || typeof dicionario !== 'object') return false;
  return Object.values(dicionario).some(valor =>
    typeof valor === 'string'
      ? valor === mensagem
      : existeNoDicionario(valor, mensagem)
  );
}

export function traduzirMensagem(mensagem, idioma, dicionario, opcional = false) {
  const indice = INDICES[idioma] ?? 0;
  const fallback = () => opcional ? undefined : GENERICA[indice];
  if (typeof mensagem !== 'string' || !mensagem.trim()) return fallback();
  const texto = mensagem.trim();

  // Aviso composto: o conteúdo foi salvo, mas a foto falhou.
  // Não exibir detalhes técnicos desconhecidos do armazenamento.
  if (texto.startsWith(AVISO_FOTO + ' ')) {
    const detalhe = traduzirMensagem(
      texto.slice(AVISO_FOTO.length).trim(), idioma, dicionario, true
    );
    return [MENSAGENS.get(AVISO_FOTO)[indice], detalhe].filter(Boolean).join(' ');
  }

  const fixa = MENSAGENS.get(texto);
  if (fixa) return fixa[indice];
  for (const [padrao, montar] of PADROES) {
    const resultado = texto.match(padrao);
    if (!resultado) continue;
    const campo = Object.prototype.hasOwnProperty.call(CAMPOS, resultado[1])
      ? CAMPOS[resultado[1]][indice]
      : null;
    if (campo) return montar(campo)[indice];
  }

  if (existeNoDicionario(dicionario, texto)) return texto;
  // Não mostrar erros internos, SQL, tokens ou mensagens desconhecidas.
  // Nas telas com mensagem alternativa, preservar a alternativa existente.
  return fallback();
}
