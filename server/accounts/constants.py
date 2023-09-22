class ResponseMessages():
    FORBIDDEN_ACCESS = 'ERROR(forbidden): 잘못된 접근입니다(인증되지 않은 사용자).'
    VERIFIED_SESSION_KEY = 'VERIFIED SESSION KEY: 유효한 세션 키입니다.'
    INVALID_CREDENTIALS = 'INVALID CREDENTIALS: 로그인 아이디 또는 비밀번호가 잘못되었습니다.'

    CREATE_SUCCESS = 'CREATE SUCCESS: 회원가입에 성공하였습니다.'
    SEND_EMAIL_SUCCESS = 'SEND EMAIL SUCCESS: 이메일을 성공적으로 발송하였습니다.'

    DUPLICATE_ID = 'DUPLICATE ID: 중복된 아이디입니다.'
    AVAILABLE_ID = 'AVAILABLE ID: 사용 가능한 아이디입니다.'
    ID_NOT_FIND = 'ID NOT FIND: 주어진 정보와 일치하는 아이디를 찾을 수 없습니다.'
    USER_NOT_FIND = 'USER NOT FIND: 주어진 정보와 일치하는 회원을 찾을 수 없습니다.'
    
    PASSWORD_MATCH = 'PASSWORD MATCH: 올바른 비밀번호입니다.'
    PASSWORD_NOT_MATCH = 'PASSWORD NOT MATCH: 회원 정보와 다른 비밀번호입니다.'
