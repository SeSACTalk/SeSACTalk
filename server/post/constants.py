class ResponseMessages():
    FORBIDDEN_ACCESS = 'ERROR(forbidden): 잘못된 접근입니다.'
    INVALID_DATA = 'ERROR(Invalid Data): 유효한 데이터가 아닙니다.'

    POST_CREATE_SUCCESS = 'CREATE SUCCESS: 게시물 업로드에 성공했습니다.'
    POST_DELETE_SUCCESS = 'DELETE SUCCESS: 게시물 삭제에 성공했습니다.'
    POST_UPDATE_SUCCESS = 'UPDATE SUCCESS: 게시물 업데이트에 성공했습니다.'

    REPORT_CREATE_SUCCESS = 'REPORT SUCCESS: 게시물 신고에 성공했습니다.'

    POST_NOT_UPDATE = 'NOT UPDATE: 요청한 게시물 업데이트 내용이 전과 다르지 않아 업데이트를 진행하지 않았습니다.'
    POST_NO_POSTS_TO_DISPLAY = 'NO POSTS TO DISPLAY: 보여줄 게시물이 없습니다.'

    NO_REPLY_TO_DISPLAY = 'NO REPLYS TO DISPLAY: 보여줄 댓글이 없습니다.'
    NO_LIKES_TO_DISPLAY = 'NO LIKES TO DISPLAY: 보여줄 좋아요가 없습니다.'

    MANAGERS_NO_POSTS_TO_DISPLAY = 'NO MANAGERS TO DISPLAY: 보여줄 매니저가 없습니다.'