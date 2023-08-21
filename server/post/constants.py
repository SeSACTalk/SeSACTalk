class ResponseMessages():
    FORBIDDEN_ACCESS = 'ERROR(forbidden): 잘못된 접근입니다.'
    INVALID_DATA = 'ERROR(Invalid Data): 유효한 데이터가 아닙니다.'

    CREATE_SUCCESS = 'CREATE SUCCESS: 게시물 업로드에 성공했습니다.'
    DELETE_SUCCESS = 'DELETE SUCCESS: 게시물 삭제에 성공했습니다.'
    UPDATE_SUCCESS = 'UPDATE SUCCESS: 게시물 업데이트에 성공했습니다.'

    NOT_UPDATE = 'NOT UPDATE: 요청한 게시물 업데이트 내용이 전과 다르지 않아 업데이트를 진행하지 않았습니다.'
    NO_POSTS_TO_DISPLAY = 'NO POSTS TO DISPLAY: 보여줄 게시물이 없습니다.'