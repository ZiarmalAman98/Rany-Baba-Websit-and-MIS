{{-- <!DOCTYPE html> --}}
{{-- <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet"  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
    crossorigin="anonymous" referrerpolicy="no-referrer" />
    <title>Login</title>
    {{-- خپل CSS فایل لینک کړه --}}
    <link rel="stylesheet" href="{{ asset('css/login-style.css') }}">

{{-- </head> --}} --}}
{{-- <body class="bg-light " style="direction: rtl;">
    <div class="container">

        <div class="login-card">
            <h5 style="font-family: Bahij Titra; margin-right: 30px;">شرکت ترانســـــــپورټي ریکـــــشه راني
                بـابـا </h5>
            {{-- <h2 style="font-family:Arial;" class="text-danger">دننه کیدل</h2> --}}
            @if(session('error'))
                <p class="error">{{ session('error') }}</p>
            @endif

            <form action="{{ route('login') }}" method="POST"style="font-family:Arial;border-radius:20px" >
                @csrf
                <div class="row ">
                    <div class="col-12 mt-2">

                        <input type="email" name="email" class="form-control mt-1" placeholder="ایمیل مو ورکړی">
                    </div>

                    <div class="col-12 mt-3">

                        <input type="password" name="password" class="form-control mt-1" placeholder="پاسورډ مو داخل کړی">
                    </div>

                <div class="options mt-3">

                    <a href="#" class="forgot">پاسورډ مو هیر شوی</a>
                </div>

                <button type="submit" class="login-btn mt-2">دننه کیدل</button>
            </form>

            <p class="register-link ">
               ایا تاسو اکاونټ لری
                &nbsp;&nbsp;<a href="{{ route('register') }}">رجسټر</a>
            </p>
        </div>
    </div>

{{-- </body> --}}
{{-- </html> --}} --}}
