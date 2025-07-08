@extends('layouts.app')
@section('title', 'کارمند پروفایل')
@section('content')
    <br>
    </style>
    <!-- Main content -->
    <section class="content" style="font-family: Bahij Zar;">
        <div class="container-fluid">

            <div class="card" style="border-radius: 0px;;">
                <div class="card card-header" style="background-color: lightgray; border-radius:0px;">
                    <h5 style="text-align: center; margin:0px;"> د کارمند معلوماتو کې تغیر راوستل </h5>
                </div>
                <div class="card-body" style="text-align:right;">


                    <form action="{{ route('user.update', $get_user) }}" method="post" enctype="multipart/form-data"
                        dir="ltr">
                        @csrf
                        @method('PUT')
                        <div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 pull-right">
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 pull-right text-left">
                            <h5 class="text-center">ټول معلومات په انګلیسي ژبه داخل کړئ</h5>

                            <div class="form-group form-group-sm">
                                <label for="dis2">Name</label>
                                <input type="text" id="name" name="name" value="{{ $get_user->name }}"
                                    class="form-control" placeholder="Enter First Name" required="required" />
                            </div>
                            <div class="form-group form-group-sm">
                                <label for="dis2">last_name</label>
                                <input type="text" id="last_name" name="last_name" value="{{ $get_user->last_name }}"
                                    class="form-control" placeholder="Enter Second Name" />
                            </div>

                            <div class="form-group form-group-sm">
                                <label for="dis2">Email</label>
                                <input type="email" id="email" name="email" class="form-control"
                                    value="{{ $get_user->email }}" placeholder="Your Email" required="required" />
                            </div>
                            <div class="form-group form-group-sm">
                                <label for="dis2">Phone Number</label>
                                <input type="text" id="phone" name="phone_number" class="form-control"
                                    value="{{ $get_user->phone_number }}" placeholder="Your Phone" required="required" />
                            </div>
                            <div class="form-group">
                                <label for="dis2">User Type</label>
                                <select class="form-control" id="type" name="user_type">
                                    <option {{ $get_user->user_type == 'Administrator' ? 'selected' : '' }}
                                        value="Administrator">Administrator</option>
                                    <option {{ $get_user->user_type == 'employee' ? 'selected' : '' }} value="employee">
                                        Employee</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="dis2">User Status</label>
                                <select class="form-control" id="state" name="status">
                                    <option {{ $get_user->status == 1 ? 'selected' : '' }} value="1">On</option>
                                    <option {{ $get_user->status == 0 ? 'selected' : '' }} value="0">Off</option>
                                </select>
                            </div>
                            <div class="form-group form-group-sm">
                                <label for="dis2">Password</label>
                                <input type="password" id="password" name="password" class="form-control"
                                    autocomplete="off" placeholder="Enter Password" required="required" />
                            </div>
                            <div class="form-group form-group-sm">
                                <label for="dis2">Confirm Password</label>
                                <input type="password" id="cpassword" name="cpassword" class="form-control"
                                    placeholder="Retype Password" required="required" />
                            </div>
                            <div class="form-group form-group-sm">
                                <label for="image">Select Image</label>
                                <input id="std_img" class="form-control" type="file" onchange="loadFile(event)"
                                    name="image" id="image" />
                            </div>

                            <div class="form-group form-group-sm text-center">
                                <img id="output" src="{{ asset('upload/user/' . $get_user->image) }}" id="selected_img"
                                    alt="Preview" height="100" width="87" />
                            </div>

                            <input type="submit" name="submit" id="submit" class="btn btn-md bg-primary"
                                value="Update" />
                            <hr />

                        </div>
                        <div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 pull-right">

                        </div>
                        <div class="clearfix"></div>
                </div>

                </form>
            </div>
        </div>
        </div>
    </section>

@endsection

@section('Pagejs')

    <script type="text/javascript">
        $('#submit').click(function() {
            var password = $(this).val();
            alert(password);
            var cpassword = $(this).val();
            if (password !== cpassword) {
                alert("Password are not match");
            }
        });
    </script>
@endsection
