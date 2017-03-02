require "bima-http"
require "bima-doorkeeper-core"
require "bima-notifications-client"
require "json"
require "sinatra/base"
require "sinatra/reloader"
require "sprockets"
require "pry"

# ATTENTSION: These credentials need to be present in config/bima_http.yml in the
# bima-notifications app
APP_NAME = "notifications_js_sdk_test_server"
ACCESS_ID = "notifications_js_sdk_test_server"
SECRET_KEY = "jEfHfCOfy7oXyfv93cLzoyvJrIgfbpLVgAtgJDfFwSakKYwV/jH5wrsLbjV8QTYBqkge1DSTDZDZM7YS93KKRg=="

class App < Sinatra::Application
  use Rack::Session::Pool, :expire_after => 2592000

  set :environment, Sprockets::Environment.new

  environment.append_path "assets/stylesheets"
  environment.append_path "assets/javascripts"

  before "/*" do
    Doorkeeper.configure do |config|
      config.client_app_name = APP_NAME
      config.site = "http://0.0.0.0:3001"
    end

    NotificationService.configure do |config|
      config.client_app_name = APP_NAME
      config.site = "http://0.0.0.0:3004"
    end

    BimaHttp.configure do |config|
      config.apps[APP_NAME] = {
        "access_id" => ACCESS_ID,
        "secret_key" => SECRET_KEY
      }
    end
  end

  get "/assets/*" do
    env["PATH_INFO"].sub!("/assets", "")
    settings.environment.call(env)
  end
  # TODO: This is a really bad hack, but Sinatra seems a  bit buggy here. Maybe
  # there is another way to get this working...
  get "/Users/*" do
    file_subpath = params["splat"].first
    filepath = "/Users/" + file_subpath

    if filepath == js_sdk_file
      send_file(js_sdk_file)
    else
      halt 404, "File not found"
    end
  end

  get "/" do
    if params["client_authorization_token"].present?
      session[:session_token] = get_session_token
      session[:service_token] = get_service_token
      redirect "/"
    end

    @js_sdk_version = js_sdk_version
    @js_sdk_file = js_sdk_file

    if session[:session_token] && session[:service_token]
      session[:user_id] = get_session_user_id

      @access_id = ACCESS_ID
      @api_endpoint = NotificationService.config.api_endpoint
      @web_socket_url = NotificationService.config.websocket_url

      erb :index, :layout => :layout
    else
      @login_url = Doorkeeper.config.login_site
      @login_url += "?app_name=#{APP_NAME}"
      @login_url += "&callback_url=#{request.url}"

      erb :no_session_index, :layout => false
    end
  end

  post "/logout" do
    begin
      session_token = session[:session_token]
      response = BimaHttp.post(
        Doorkeeper.config.endpoints[:logout],
        {
          :params => { :session_token => session_token },
          :headers => { :accept => :json },
          :app_name => APP_NAME
        }
      )
    rescue => e
    ensure
      session[:session_token] = nil
      session[:service_token] = nil
      session[:user_id] = nil

      redirect "/"
    end
  end

  post "/create_random_broadcast_notification" do
    begin
      message = "Random broadcast notification (#{Time.now.to_i})"
      NotificationService::Notification.create(:message => message)
    rescue => e
    end
  end

  post "/create_random_user_notification" do
    begin
      user_id = session[:user_id]
      message = "Random user notification for user #{user_id} (#{Time.now.to_i})"
      NotificationService::Notification.create({
        :context => "user",
        :user_id => user_id,
        :message => message,
      })
    end
  end

  private

  def get_session_token
    authorization_token = params["client_authorization_token"]
    response = BimaHttp.post(
      Doorkeeper.config.endpoints[:session_token],
      {
        :params => { :client_authorization_token => authorization_token },
        :headers => { :accept => :json },
        :app_name => APP_NAME
      }
    )

    JSON.parse(response.body)["data"]["attributes"]["jwt"]
  rescue => e
    nil
  end

  def get_service_token
    if session[:session_token]
      Doorkeeper::Token.create_service_token(session[:session_token]).jwt
    end
  rescue => e
    nil
  end

  def get_session_user_id
    Doorkeeper::User.
      authenticate_user(:service_token => session[:service_token]).
      id
  end

  def js_sdk_file
    path = "../../dist/#{js_sdk_version}/bima-notifications-sdk.js"
    File.expand_path(path, File.dirname(__FILE__))
  end

  def js_sdk_version
    path = "../../package.json"
    package_file = File.expand_path(path ,File.dirname(__FILE__))
    data = JSON.parse(File.read(package_file)) || {}
    data["version"]
  end
end
