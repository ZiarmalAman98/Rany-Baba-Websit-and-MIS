<nav class="main-header navbar navbar-expand navbar-light border-bottom"
    style="background-color:#1a0410; color:rgba(255, 255, 255, 0.956); border-left:2px;">
    <ul class="navbar-nav">
        <li class="nav-item">
            <a class="nav-link text-white" data-widget="pushmenu" href="#"><i class="fa fa-bars"></i></a>
        </li>
    </ul>

    <!-- Right navbar links -->
    <ul class="navbar-nav mr-auto">
        <li class="dropdown">
            <a class="dropdown-toggle" dir="ltr" data-toggle="dropdown" aria-label="Open Profile Menu">
                <img src="{{ asset('upload/user/' . (Auth::user() ? Auth::user()->image : 'default.jpg')) }}"
                    class="img-circle elevation-3" style="opacity: .8" height="60px" width="60px">

                <i style="font-size:25px;" class="fa fa-user fs-4"></i>
            </a>


            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li class="dropdown-header">
                    <img src="{{ asset('upload/user/' . (Auth::user() ? Auth::user()->image : 'default.jpg')) }}"
                        class="img-circle elevation-3" style="opacity: .8" height="60px" width="60px">
                    {{-- <h4 class="mt-2">{{ Auth::user()->name }}</h4> --}}

                </li>


                <li>
                    {{-- <a class="dropdown-item" href="{{ route('user.show', Auth::user()->id) }}"> --}}
                        <i class="fa fa-user me-2 fs-5"></i> پروفایل
                    </a>
                </li>



                <li>
                    <a class="dropdown-item" href="{{ url('logout') }}">
                        <i class="fa fa-sign-out me-2 fs-5"></i> وتل
                    </a>
                </li>
                <li>
                    <hr class="dropdown-divider">
                </li>







            </ul>
            <!-- End Profile Dropdown Items -->


        </li>

    </ul>

</nav>
<!-- Main Sidebar Container -->
<aside class="main-sidebar sidebar-dark-primary">
    <!-- Brand Logo -->
    <a href="{{ url('admin/dashboard') }}" class="brand-link" style="background-color:#1a0410;">

        <h6 style="font-family: Bahij Titra; margin-right: 10px;color:coral;margin-top:20px;">شرکت ترانســـــــپورټي
            ریکـــــشه راني
            بـابـا </h6>
        <center>
            <div>
                <img src="{{ asset('icons/2.webp') }}" width="100px" height="100px" alt="ریکشه راني بابا"
                    class="img image-fluid rounded-circle">

            </div>
        </center>
    </a>

    <!-- Sidebar -->
    <div class="sidebar " style="font-family:Bahij Zar; background-color:#1a0410;">
        <div style="font-size: 20px;">
            {{-- <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                <div class="image">
                <img src="{{ asset('upload/user/' . (Auth::user() ? Auth::user()->image : 'default.jpg')) }}" class="img-circle elevation-3" style="opacity: .8" height="80" width="80">

                </div>
                <div class="info">
                <a href="#" class="d-block">
                  {{ Auth::check() ? Auth::user()->name : 'کارن نوم ندی موندل شوی' }}
                 </a>

                </div>
            </div> --}}

            <nav class="mt-2">
                <ul class="nav nav-pills nav-sidebar flex-lg-column" data-widget="treeview" role="menu"
                    data-accordion="false">
                    <li class="nav-item has-treeview menu-open">
                        <a href="{{ url('admin/dashboard') }}" class="nav-link active">
                            <i class="nav-icon fa fa-dashboard"></i>
                            <p>کورپاڼه</p>
                        </a>
                    </li>

                    <li class="nav-item has-treeview">
                        <a href="#" class="nav-link">
                            <i class="nav-icon fa fa-bus"></i>
                            <p>
                                د موټر مالک
                                <i class="fa fa-angle-left right"></i>
                            </p>
                        </a>
                        <ul class="nav nav-treeview">
                            <li class="nav-item">
                                <a href="{{ route('owner.index') }}" class="nav-link">
                                    <i class="fa fa-user nav-icon"></i>
                                    <p>نوی مالک اضاف کړئ</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{ route('car.index') }}" class="nav-link">
                                    <i class="fa fa-truck nav-icon"></i>
                                    <p>موټر ثبتول</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{ route('sponser.index') }}" class="nav-link">
                                    <i class="fa fa-address-card nav-icon"></i>
                                    <p>ضامنینو ثبتول</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{ route('driver.index') }}" class="nav-link">
                                    <i class="fa fa-male nav-icon"></i>
                                    <p>ډریور ثبتول</p>
                                </a>
                            </li>
                        </ul>
                    </li>

                    <!-- Setting Menu -->
                    <li class="nav-item has-treeview">
                        <a href="#" class="nav-link">
                            <i class="nav-icon fa fa-cogs"></i>
                            <p>
                                تنظیمات
                                <i class="fa fa-angle-left right"></i>
                            </p>
                        </a>
                        <ul class="nav nav-treeview">
                            <li class="nav-item">
                                <a href="{{ route('province.index') }}" class="nav-link">
                                    <i class="fa fa-edit nav-icon"></i>
                                    <p>ولایت اضافه کړئ</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{ route('district.index') }}" class="nav-link">
                                    <i class="fa fa-edit nav-icon"></i>
                                    <p>ولسوالي اضافه کړئ</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{ route('directions.index') }}" class="nav-link">
                                    <i class="fa fa-edit nav-icon"></i>
                                    <p>مسیر اضافه کړئ</p>
                                </a>
                            </li>
                        </ul>
                    </li>

                    @if (Auth::check() && Auth::user()->user_type == 'Administrator')
                        <!-- Admin Menu -->
                        <li class="nav-item has-treeview">
                            <a href="#" class="nav-link">
                                <i class="nav-icon fa fa-users"></i>
                                <p>کارمندان</p>
                            </a>
                            <ul class="nav nav-treeview">
                                <li class="nav-item">
                                    <a href="{{ route('user.index') }}" class="nav-link">
                                        <i class="fa fa-user nav-icon"></i>
                                        <p>نوی کارمند اضافه کړئ</p>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    @endif

                </ul>
            </nav>
        </div>
    </div>
</aside>
